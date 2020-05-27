const customSelect = () => {
  const $button = document.querySelector(".start--button");
  var x, selElmnt, a, b;
  /* Look for any elements with the class "custom-select": */
  x = document.querySelector(".custom-select");
  selElmnt = x.querySelector("select");
  /* For each element, create a new DIV that will act as the selected item: */
  a = document.createElement("div");
  a.setAttribute("class", "select-selected");
  a.setAttribute("data-ext", selElmnt.options[selElmnt.selectedIndex].value);
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x.appendChild(a);
  /* For each element, create a new DIV that will contain the option list: */
  b = document.createElement("div");
  b.setAttribute("class", "select-items select-hide");

  [...selElmnt.options].forEach((option) => {
    const c = document.createElement("div");
    c.innerHTML = option.innerHTML;
    c.addEventListener("click", function (_) {
      /* When an item is clicked, update the original select box,
          and the selected item: */
      let h = this.parentNode.previousSibling;
      for (let i = 0; i < selElmnt.length; i++) {
        if (selElmnt.options[i].innerHTML == this.innerHTML) {
          selElmnt.selectedIndex = i;
          h.innerHTML = this.innerHTML;
          h.setAttribute("data-ext", selElmnt.options[i].value);
          this.parentNode
            .querySelectorAll("same-as-selected")
            .forEach((el) => el.removeAttribute("class"));
          this.setAttribute("class", "same-as-selected");
          break;
        }
      }
      h.click();
    });
    b.appendChild(c);
  });

  x.appendChild(b);
  a.addEventListener("click", function (e) {
    /* When the select box is clicked, close any other select boxes,
      and open/close the current select box: */
    e.stopPropagation();
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
    $button.classList.toggle("hidden");
  });
  /* If the user clicks anywhere outside the select box,
  then close all select boxes: */
  document.addEventListener("click", (e) => {
    e.stopPropagation();
    a.classList.remove("select-arrow-active");
    a.nextSibling.classList.add("select-hide");
  });
};

export { customSelect };
