//"PAQO07NxKKWLNmy3lyeyt"

// Run when page has finished loading
window.onload = function () {
  // console.log("load");
  loadData();
};

function loadData() {
  // run the three requests in parallel
  Promise.all([
    loadTotalPrice(),
    loadTotalDonations(),
    loadLastFive()
  ]).then(function (results) {
    var totalprice = results[0];
    var totaldonations = results[1]; // not used right now, but kept
    var lastfive = results[2];

    var lastfiveContainer = document.getElementsByClassName("last_five")[0];
    // console.log(lastfive);

    if (lastfive && lastfive.length && lastfiveContainer) {
      for (var i = 0; i < lastfive.length; i++) {
        if (lastfive[i].hidden_amount != true) {
          var donation = lastfive[i];
          var div = document.createElement("div");
          div.className = "donation";
          div.innerHTML =
            '<p class="donation_name donation_text">' +
            donation.name +
            " gav " +
            donation.amount +
            "kr " +
            "</p>";
          lastfiveContainer.appendChild(div);
        }
      }
    }

    var percentage = (totalprice.amount / 200000) * 100;
    // console.log(percentage);

    var bar = document.getElementById("bar");
    var indicator = document.getElementById("indicator");
    if (bar) bar.style.height = percentage + "%";
    if (indicator) indicator.style.height = percentage + "%";

    var formatted = formatSEK(totalprice.amount);
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

      // shrink text until it fits
      while (text.scrollWidth > box.clientWidth && size > 0) {
        // console.log(size);
        size--;
        text.style.fontSize = size + "px";
        goal.style.fontSize = size + "px";
      }
    }
  }).catch(function (err) {
    console.error(err);
  });
}

function formatSEK(n) {
  n = Number(n || 0);
  // Try proper currency formatting if available
  try {
    return n.toLocaleString("sv-SE", {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0
    });
  } catch (e) {
    // Fallback for old browsers without Intl
    return n + " kr";
  }
}

/* --------- DATA LOADERS --------- */

function loadTotalDonations() {
  var SOURCE =
    "https://musikhjalpen-franceska.herokuapp.com/server/fundraisers/donations/1miEB4p0tI1WQJgRWZEEb9/number-of-donations";
  var PROXY =
    "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(SOURCE);

  return simpleFetchJson(PROXY);
}

function loadLastFive() {
  var SOURCE =
    // "https://musikhjalpen-franceska.herokuapp.com/server/fundraisers/donations/1miEB4p0tI1WQJgRWZEEb9/0";
    "https://musikhjalpen-franceska.herokuapp.com/server/fundraisers/donations/PAQO07NxKKWLNmy3lyeyt/0";
  var PROXY =
    "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(SOURCE);

  return simpleFetchJson(PROXY);
}

function loadTotalPrice() {
  var SOURCE =
    // "https://musikhjalpen-franceska.herokuapp.com/server/fundraisers/1miEB4p0tI1WQJgRWZEEb9?fields[]=amount&fields[]=prev_amount";
    "https://musikhjalpen-franceska.herokuapp.com/server/fundraisers/PAQO07NxKKWLNmy3lyeyt?fields%5B%5D=amount&fields=prev_amount";
  var PROXY =
    "https://api.codetabs.com/v1/proxy?quest=" + encodeURIComponent(SOURCE);

  return simpleFetchJson(PROXY);
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
