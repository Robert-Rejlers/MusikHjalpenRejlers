window.addEventListener("load", () => {
  console.log("load");
  loadData()
});

async function loadData() {
    const SOURCE =
      "https://musikhjalpen-franceska.herokuapp.com/server/fundraisers/1miEB4p0tI1WQJgRWZEEb9?fields[]=amount&fields[]=prev_amount";
    const PROXY = "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(SOURCE); //rätt snabb

    try {
      const res = await fetch(PROXY, { cache: "no-store" });
      console.log(res)
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json(); // upstream JSON is passed through
      console.log(data)
      // Example shape: { "amount": 24000, "prev_amount": 23000 }
      const fmt = n =>
        Number(n ?? 0).toLocaleString("sv-SE", {
          style: "currency",
          currency: "SEK",
          maximumFractionDigits: 0,
        });

      document.getElementById("amount").textContent = fmt(data.amount);
    } catch (err) {
      console.error(err);
      document.getElementById("amount").textContent = "Unavailable";
    }
}