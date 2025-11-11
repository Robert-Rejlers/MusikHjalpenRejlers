window.addEventListener("load", () => {
  console.log("load");
  loadData()
});

async function loadData() {
    var totalprice = await loadtotalprice()
    var totaldonations = await loadtotaldonations()
    var lastfive = await loadlastfive()

    var lastfiveContainer = document.getElementsByClassName("last_five")[0]
    console.log(lastfive)
    lastfive.forEach(donation => {
        const div = document.createElement("div");
        div.className = "donation";

        div.innerHTML = `
            <p class="donation_name donation_text">${donation.name} gav ${donation.amount}</p>
        `;
        lastfiveContainer.appendChild(div);
    });

    var percentage = (totalprice.amount / 200000) * 100
    console.log(percentage)
    document.getElementById("bar").style.height = percentage + "%";
    document.getElementById("indicator").style.height = percentage + "%";

    var formatted = totalprice.amount.toLocaleString("sv-SE", {
        style: "currency",
        currency: "SEK",
        maximumFractionDigits: 0, // optional – removes decimals
    });
    formatted += ""
    console.log(formatted)
    document.getElementById("amount").innerText = formatted + ""

    const box = document.getElementById("box");
    const text = document.getElementById("amount");
    const goal = document.getElementById("goal");

    let size = 100; // start big
    text.style.fontSize = size + "px";

    // shrink text until it fits
    while (text.scrollWidth > box.clientWidth && size > 0) {
        console.log(size)
        size--;
        text.style.fontSize = size + "px";
        goal.style.fontSize = size + "px";
    }
    // bar.style.height = percentage + "%";
}

async function loadtotaldonations() {
    const SOURCE =
      "https://musikhjalpen-franceska.herokuapp.com/server/fundraisers/donations/1miEB4p0tI1WQJgRWZEEb9/number-of-donations";
    const PROXY = "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(SOURCE); //rätt snabb

    try {
      const res = await fetch(PROXY, { cache: "no-store" });
      console.log(res)
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json(); // upstream JSON is passed through
      console.log(data)
      return data;
      // Example shape: { "amount": 24000, "prev_amount": 23000 }
    //   document.getElementById("amount").textContent = fmt(data.amount);
    } catch (err) {
      console.error(err);
    //   document.getElementById("amount").textContent = "Unavailable";
    }
}

async function loadlastfive() {
    const SOURCE =
      "https://musikhjalpen-franceska.herokuapp.com/server/fundraisers/donations/1miEB4p0tI1WQJgRWZEEb9/0";
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
    return data;
    //   document.getElementById("amount").textContent = fmt(data.amount);
    } catch (err) {
      console.error(err);
    //   document.getElementById("amount").textContent = "Unavailable";
    }
}

async function loadtotalprice() {
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
    return data;

      document.getElementById("amount").textContent = fmt(data.amount);
    } catch (err) {
      console.error(err);
      document.getElementById("amount").textContent = "Unavailable";
    }
}