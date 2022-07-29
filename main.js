var config = {};
var userconfig = JSON.parse(localStorage.getItem("__options"));

if (
  userconfig != null &&
  userconfig != "" &&
  userconfig != undefined &&
  userconfig != {}
) {
  config = {
    darkmode: userconfig.darkmode,
    autowrite: userconfig.autowrite,
  };
} else {
  config = {
    darkmode: true,
    autowrite: false,
  };
}

const setconfig = (config) => {
  //chekedboxes
  $("#darkmode").prop("checked", config.darkmode);
  $("#autowrite").prop("checked", config.autowrite);

  var theme = "";
  if (config.darkmode == true) {
    theme = "dark";
  } else if (config.darkmode == false) {
    theme = "light";
  }
  $("html").attr("data-theme", theme);
};

setconfig(config);

(selectTag = document.querySelectorAll("select")),
  selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
      let selected =
        id == 0
          ? country_code == "en-GB"
            ? "selected"
            : ""
          : country_code == "hi-IN"
          ? "selected"
          : "";
      let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
      tag.insertAdjacentHTML("beforeend", option);
    }
  });
$("#pre-select").val("en-GB");
$("#post-select").val("es-ES");
$("#pre").on("keyup", function () {
  if (config.autowrite == true) {
    var q = $("#pre").val();
    var pre = $("#pre-select").val();
    var post = $("#post-select").val();
    if (!q) return;
    $("#translate").attr("aria-busy", true);
    $("#post").attr("placeholder", "Traduciendo...");
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(
      `https://api.mymemory.translated.net/get?q=${pre_splitting(
        q
      )}&langpair=${pre}|${post}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => saveData(result))
      .catch((error) => console.log("error", error));
  }
});
$("#translate").on("click", function () {
  var q = $("#pre").val();
  var pre = $("#pre-select").val();
  var post = $("#post-select").val();
  if (!q) return;
  $("#translate").attr("aria-busy", true);
  $("#post").attr("placeholder", "Traduciendo...");
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(
    `https://api.mymemory.translated.net/get?q=${pre_splitting(
      q
    )}&langpair=${pre}|${post}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => saveData(result))
    .catch((error) => console.log("error", error));
});

$("#speech-pre").on("click", function () {
  var txt = $("#pre").val();
  var lang = $("#pre-select").val();
  speech(txt, lang);
});

$("#speech-post").on("click", function () {
  var txt = $("#post").val();
  var lang = $("#post-select").val();
  speech(txt, lang);
});

$("#copy-pre").on("click", function () {
  var txt = $("#pre").val();
  clipboard(txt);
});

$("#copy-post").on("click", function () {
  var txt = $("#post").val();
  clipboard(txt);
});

$("#exchange").on("click", function () {
  var pre = $("#pre").val();
  var post = $("#post").val();
  var pre_select = $("#pre-select").val();
  var post_select = $("#post-select").val();
  $("#pre").val(post);
  $("#pre-select").val(post_select);
  $("#post").val(pre);
  $("#post-select").val(pre_select);
});

$("#config").on("click", function () {
  $("#dialog").attr("open", true);
});
$("#cancel-option").click(function (e) {
  e.preventDefault();
  $("#dialog").attr("open", false);
});
$("#confirm-option").click(function (e) {
  e.preventDefault();
  localStorage.setItem("__options", JSON.stringify(config));
  $("#dialog").attr("open", false);
  setconfig(config);
});

$("#darkmode").on("change", function () {
  config.darkmode = $(this).is(":checked");
});
$("#autowrite").on("change", function () {
  config.autowrite = $(this).is(":checked");
});

const saveData = (json) => {
  text = json.responseData.translatedText;
  $("#post").val(post_splitting(text));
  $("#translate").attr("aria-busy", false);
  $("#post").attr("placeholder", "");
};
const pre_splitting = (text) => {
  var a = text.split(/\r\n|\r|\n/g);
  if (a.length > 1) {
    var b = "";
    a.forEach((txt) => {
      b += `${txt}\\n`;
    });
    return b;
  } else {
    return text;
  }
};
const post_splitting = (text) => {
  var text = text.split("\\n");
  var b = "";
  text.forEach((txt) => {
    b += `${txt}\n`;
  });
  return b;
};

const speech = (text, lang) => {
  sp = new SpeechSynthesisUtterance(text);
  sp.lang = lang;
  speechSynthesis.speak(sp);
};

const clipboard = (txt) => {
  navigator.clipboard.writeText(txt);
};
