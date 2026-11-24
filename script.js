// Rejlers bössa – change the id here next year
// (2025: "PAQO07NxKKWLNmy3lyeyt" on the old herokuapp API)
var FUNDRAISER_ID = "Jy4ONEvWDVEIQ8XoZ2GFkI";
var API_BASE = "https://bossan-api.musikhjalpen.se/server/entries/";

// The API sends no CORS headers, so the browser has to go through a proxy.
// Free proxies, tried in turn until one answers. Both are flaky, so each
// request keeps cycling through them, pausing RETRY_SECONDS after each round.
var PROXIES = [
  "https://bossan-proxy.mh-display.workers.dev/?quest="
];
var RETRY_SECONDS = 15;

window.onload = function () {
  // console.log("load");
  loadData();
};

function loadData() {
  Promise.all([loadFundraiser(), loadLastFive()])
    .then(function (results) {
      console.log(results);
      var fundraiser = results[0]; // { amount, goal, donationCount, ... }
      var lastfive = results[1]; // [{ amount, name, paidUtc }, ...]

      var lastfiveContainer = document.getElementsByClassName("last_five")[0];
      console.log(lastfive);

      if (lastfive && lastfive.length && lastfiveContainer) {
        for (var i = 0; i < lastfive.length; i++) {
          var donation = lastfive[i];
          var div = document.createElement("div");
          div.className = "donation";

          // Hidden name/amount now come as null (no more hidden_amount flag)
          var donation_name = donation.name || "En hemlig hjälte";
          var donation_text;
          if (donation.amount != null) {
            donation_text = donation_name + " gav " + donation.amount + "kr ";
          } else {
            donation_text = donation_name + " gav en donation";
          }

          // textContent instead of innerHTML, since names are typed in by donors
          var p = document.createElement("p");
          p.className = "donation_name donation_text";
          p.textContent = donation_text;
          div.appendChild(p);
          lastfiveContainer.appendChild(div);
        }
      }

      var goalAmount = fundraiser.goal || 150000; // goal now comes from the API
      var percentage = Math.min((fundraiser.amount / goalAmount) * 100, 100);
      // console.log(percentage);

      var goal = document.getElementById("goal")
      goal.innerHTML = goalAmount
      var bar = document.getElementById("bar");
      var indicator = document.getElementById("indicator");
      if (bar) bar.style.height = percentage + "%";
      if (indicator) indicator.style.height = percentage + "%";

      var formatted = formatSEK(fundraiser.amount);
      // console.log(formatted);

      var amountEl = document.getElementById("amount");
      if (amountEl) {
        amountEl.innerText = formatted + "";
      }

      var box = document.getElementById("box");
      var text = amountEl;
      var goal = document.getElementById("goal");

      if (box && text && goal) {
        var size = 100; // start big
        text.style.fontSize = size + "px";
        goal.style.fontSize = size + "px";

        while (text.scrollWidth > box.clientWidth && size > 0) {
          // console.log(size);
          size--;
          text.style.fontSize = size + "px";
          goal.style.fontSize = size + "px";
        }
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

function formatSEK(n) {
  n = Number(n || 0);
  try {
    return n.toLocaleString("sv-SE", {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0,
    });
  } catch (e) {
    // Fallback for old browsers without Intl
    return n + " kr";
  }
}

/* --------- DATA LOADERS --------- */

// { id, title, amount, prevAmount, donationCount, goal, ... }
function loadFundraiser() {
  var SOURCE = API_BASE + "by-id/" + FUNDRAISER_ID;

  return fetchViaProxy(SOURCE);
}

// API returns { donations: [...], pageNumber, totalPageCount }
// – unwrap it and keep the five latest
function loadLastFive() {
  var SOURCE = API_BASE + "donations/" + FUNDRAISER_ID + "/0";

  return fetchViaProxy(SOURCE).then(function (data) {
    return ((data && data.donations) || []).slice(0, 5);
  });
}

// Tries the proxies in PROXIES in turn until one returns JSON, pausing
// RETRY_SECONDS after each full round. Never gives up.
// The extra "&_=<time>" stops a proxy from serving an old cached answer.
function fetchViaProxy(source) {
  function attempt(i) {
    var url =
      PROXIES[i % PROXIES.length] +
      encodeURIComponent(source) +
      "&_=" +
      new Date().getTime();
    return simpleFetchJson(url).catch(function () {
      var endOfRound = (i + 1) % PROXIES.length === 0;
      return wait(endOfRound ? RETRY_SECONDS * 1000 : 0).then(function () {
        return attempt(i + 1);
      });
    });
  }
  return attempt(0);
}

function wait(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

/**
 * Small helper that wraps fetch in a Promise and returns parsed JSON.
 * If fetch does not exist, this will fail gracefully (see next step).
 */
function simpleFetchJson(url) {
  if (!window.fetch) {
    // very old browser – reject so we can see it in console
    return Promise.reject(new Error("fetch is not available"));
  }

  return fetch(url, { cache: "no-store" })
    .then(function (res) {
      // console.log(res);
      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }
      return res.json();
    })
    .then(function (data) {
      // console.log(data);
      return data;
    })
    .catch(function (err) {
      console.error(err);
      throw err;
    });
}