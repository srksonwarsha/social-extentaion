/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function getParameterByName(queryString, name) {
  try {
    // Escape special RegExp characters
    name = name.replace(/[[^$.|?*+(){}\\]/g, "\\$&");
    // Create Regular expression
    var regex = new RegExp("(?:[?&]|^)" + name + "=([^&#]*)");
    // Attempt to get a match
    var results = regex.exec(queryString);
    return decodeURIComponent(results[1].replace(/\+/g, " ")) || "";
  } catch (e) {
    return "";
  }
}

scrollToCard = (index) => {
  console.log("scrollToCard:", index);
  return new Promise((t, l) => {
    try {
      const item = document.querySelectorAll(".MjjYud")[index];

      item.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });

      t(true);
    } catch (e) {
      console.log(e);
      t(false);
    }
  });
};

timeout = (e) => {
  return new Promise((t, l) => {
    try {
      setTimeout(function () {
        t();
      }, e);
    } catch (e) {
      console.log(e);
    }
  });
};

scrapCurrentPage = (index) => {
  let data = {};
  return new Promise((resolve, reject) => {
    try {
      const card = document.querySelectorAll(".MjjYud")[index];

      //if (card.querySelectorAll(".yuRUbf").length > 0) {
      //title
      try {
        data.title = card
          .querySelector("a[jsname='UWckNb']")
          .querySelector("h3.DKV0Md").innerText;
      } catch (e) {
        console.log("Error: Title", e);
      }

      //phones
      // try {
      //   if (card.querySelectorAll("div[data-sncf='1']").item(0)) {
      //     const text = card
      //       .querySelectorAll("div[data-sncf='1']")
      //       .item(0).innerText;

      //     const phones = new libphonenumber.findPhoneNumbersInText(text, "US");
      //     console.log("phones:", JSON.stringify(phones));

      //     data.phone = phones
      //       .map((x) => (x.number ? x.number.number : ""))
      //       .join(",");

      //     // const regexp = new RegExp("\\+?\\(?\\d*\\)? ?\\(?\\d+\\)?\\d*([\\s./-]?\\d{2,})+","g");
      //     // const phone_numbers = [...text.matchAll(regexp)];

      //     // var phones = [];
      //     // for (const match of phone_numbers) {
      //     //   //document.write(match[0]);
      //     //   //document.write('<br />');
      //     //   phones.push(match[0].match(/([0-9]+)/gi));
      //     // }

      //     // data.phone =  phones.join(",");
      //   }
      // } catch (e) {
      //   data.phone = "";
      //   console.log("Error: Phone", e);
      // }
      // Extract phone numbers using RegExp if libphonenumber fails
      // try {
      //   let phoneNumbers = card.innerText.match(/\+?\(?\d{1,4}\)?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g);
      //   data.phone = phoneNumbers ? phoneNumbers.join(",") : "";
      // } catch (e) {
      //   data.phone = "";
      //   console.log("Error: Phone", e);
      // }
      // Extract phone numbers using RegExp if libphonenumber fails
      try {
        let phoneNumbers = card.innerText.match(/\+?\(?\d{1,4}\)?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g);
        data.phone = phoneNumbers ? phoneNumbers.join(",") : "";
      } catch (e) {
        data.phone = "";
        console.log("Error: Phone", e);
      }



      // //email
      // try {
      //   if (card.querySelectorAll("div[data-sncf='1']").item(0)) {
      //     const emails = card.innerText.match(
      //       /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
      //     );
      //     data.email = emails.join(",");
      //   }
      // } catch (e) {
      //   data.email = "";
      //   console.log("Error: Email", e);
      // }
      try {
        let emails = card.innerText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
        data.email = emails ? emails.join(",") : "";
      } catch (e) {
        data.email = "";
        console.log("Error: Email", e);
      }

      //website url
      try {
        // data.website = card.querySelectorAll(".yuRUbf")[0]
        // .querySelector("a")
        // .getAttribute("href")

        data.website = card
          .querySelector("a[jsname='UWckNb']")
          .getAttribute("href");
      } catch (e) {
        data.website = "";
        console.log("Error: Url", e);
      }
      resolve(data);
      // }else{
      //   resolve(null);
      // }
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
};

nextPage = () => {
  return new Promise((e, t) => {
    try {
      if (
        "Next" ==
        document.getElementsByClassName("d6cvqb").item(1).item(1).innerText
      ) {
        document
          .getElementsByClassName("d6cvqb")
          .item(1)
          .firstElementChild.click();
        let t = document.getElementsByClassName("currentPageNo").item(0),
          l = parseInt(t.innerText);
        (t.innerText = ++l), e();
      }
    } catch (e) {
      console.log(e);
    }
  });
};

getMobile = (data) =>
  new Promise((t, n) => {
    try {
      const query =
        (data.title ?? "") !== "" ? data.title : data.name + " " + data.address;

      chrome.runtime.sendMessage(
        { type: "get_phone_from_address", query: query },
        (response) => {
          if (response) {
            console.log("getMobile - " + response);
            t(response ?? "");
          } else {
            t("");
          }
        }
      );
    } catch (e) {
      console.log(e);
      t("");
    }
  });

const insertItem = (keyword, data) => {
  console.log("insertItem:", JSON.stringify(data));
  return new Promise(async (resolve, reject) => {
    chrome.storage.local.get("scrap", function (res) {
      if (res.scrap.hasOwnProperty(keyword)) {
        //if (typeof res.scrap[keyword] !== "undefined") {
        if (res.scrap[keyword].data instanceof Array) {
          //res.scrap[keyword].data = [...res.scrap[keyword].data,data];
          res.scrap[keyword].data.push(data);
        } else {
          res.scrap[keyword].data = [data];
        }
      } else {
        res.scrap[keyword] = {
          name: keyword,
          data: [data],
        };
      }
      chrome.storage.local.set({ scrap: res.scrap });
      resolve(true);
    });
  });
};

const range = (start, end, length = end - start + 1) =>
  Array.from({ length }, (_, i) => start + i);

const isObjectEmpty = (objectName) => {
  return Object.keys(objectName).length === 0;
};

startScraping = (startIndex, keyword, setting) => {
  console.log("startScraping start: ", startIndex);

  return new Promise(async (resolve, reject) => {
    let items = document.querySelectorAll(".MjjYud");

    const totalCards = items.length;

    if (totalCards > 0) {
      console.log("startScraping total card:", totalCards);

      //var keywordData = [];

      // const arr = range(startIndex, totalCards - 1);
      // console.log("arr:", JSON.stringify(arr));
      // await asyncForEach(arr, async (i, index) => {
      //for (let i = startIndex; i < totalCards; i++) {
      //const scrollCardSuccess = await scrollToCard(i);
      //await timeout((setting.delay ?? 1) * 1000);

      //scroll
      for (let i = startIndex; i < totalCards; i++) {
        try {
          items[i].scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest",
          });
        } catch (e) {
          console.log("scroll Error:", e);
        }

        const cardPopupResult = await scrapCurrentPage(i);

        console.log(
          "startScraping cardPopupResult:",
          JSON.stringify(cardPopupResult)
        );

        if (cardPopupResult && !isObjectEmpty(cardPopupResult)) {
          await insertItem(keyword, cardPopupResult);
        } else {
          console.log(
            "startScraping card " + i + ": data not found",
            totalCards
          );
        }
      }
      // });

      //await insertItem(keyword, keywordData);

      await timeout((setting.delay ?? 1) * 1000);

      const moreResultButtons = document.querySelectorAll(
        "a[aria-label='More results']"
      );

      if (moreResultButtons.length > 0) {
        moreResultButtons[0].scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
      resolve(totalCards);
    } else {
      resolve(false);
    }
  });
};

(async () => {
  console.log("Scraping Started");

  const keyword = getParameterByName(location.href, "keyword");
  console.log("Scraping keyword:", keyword);
  const { setting } = await chrome.storage.local.get("setting");
  console.log("Scraping setting:", setting);
  var isDone = false;

  if (keyword) {
    var scrapingIndex = 0;
    var isTotalSame = false;

    while (!isDone) {
      const result = await startScraping(scrapingIndex, keyword, setting);
      scrapingIndex = result;

      console.log("startScraping response:", result);

      if (!result) {
        isDone = true;
      } else {
        //next page

        try {
          // let items = document.querySelectorAll(
          //   ".resultbox"
          // );

          // console.log("startScraping current Items:",items.length)

          console.log("isTotalSame:", isTotalSame);
          console.log("scrapingIndex:", scrapingIndex);

          const currentPage = Number(
            document.querySelector(".YyVfkd").innerText ?? "0"
          );
          console.log("Current Page:", currentPage);

          const nextPage = document.querySelector(
            `a[aria-label^='Page ${currentPage + 1}']`
            //`a[style='background:url(/images/nav_logo321_hr.webp) no-repeat;background-position:-74px -112px;background-size:167px;width:20px']`
          );
          //console.log("moreResultButtons size:", moreResultButtons.length);

          if (nextPage && !isTotalSame) {
            console.log("more data found");

            //add keyword
            nextPage.href = nextPage.href + "&keyword=" + keyword;
            console.log("final url: " + nextPage.href);

            nextPage.click();
            await timeout((setting.delay ?? 1) * 1000);

            isTotalSame =
              document.querySelectorAll(".MjjYud").length === scrapingIndex;
          } else {
            console.log("data not found");
            isDone = true;
          }
        } catch (e) {
          console.log(e);
        }
      }
    }

    //auto download file
    chrome.runtime.sendMessage({
      type: "download",
      keyword: keyword,
    });

    console.log("Scraping done:", isDone);
  } else {
    console.log("Keyword not found");
  }
})();

(async () => {
  try {
    chrome.storage.onChanged.addListener(function (e, t) {
      let l = document.getElementsByClassName("collectedData").item(0),
        a = parseInt(l.innerText);
      l.innerText = ++a;
    });
  } catch (e) {
    console.log(e);
  }
})();
