let latestState = null;

self.addEventListener("message", (event) => {
  if (event.data?.type === "STATE_UPDATE") {
    latestState = event.data.payload || null;
  }
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.endsWith("/client/current-game-state.json")) {
    if (!latestState) {
      event.respondWith(new Response("{}", { status: 404, headers: { "Content-Type": "application/json" } }));
      return;
    }
    event.respondWith(
      new Response(latestState, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
  }
});
