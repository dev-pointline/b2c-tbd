(() => {
  const script = document.currentScript;
  const token = script?.dataset?.telemetryToken;
  const baseUrl = script?.dataset?.telemetryBaseUrl;
  if (!token || !baseUrl) return;

  const storageKey = "pipeline-telemetry-session";
  let sessionId = window.sessionStorage.getItem(storageKey);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    window.sessionStorage.setItem(storageKey, sessionId);
  }

  const query = new URLSearchParams(window.location.search);
  const attributionMeta = {
    pl_touch: query.get("pl_touch"),
    pl_pipeline: query.get("pl_pipeline"),
    pl_channel: query.get("pl_channel"),
    pl_asset: query.get("pl_asset"),
    pl_variant: query.get("pl_variant"),
  };

  const send = (eventType, extra = {}) => {
    fetch(baseUrl + "/api/telemetry/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telemetryToken: token,
        eventType,
        sessionId,
        metadata: attributionMeta,
        ...extra,
      }),
      keepalive: true,
    }).catch(() => null);
  };

  send("page_view", { channel: document.referrer ? "referral" : "direct" });

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element
      ? event.target.closest("[data-telemetry-event], a, button")
      : null;
    if (!target) return;
    const eventType = target.getAttribute("data-telemetry-event") || "cta_click";
    const assetId = target.getAttribute("data-asset-id");
    const campaign = target.getAttribute("data-campaign");
    send(eventType, { assetId, campaign });
  }, { capture: true });
})();