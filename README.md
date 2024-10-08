```js
[...document.querySelector(".docblock-argstable-body").querySelectorAll("tr")]
  .map((row) => {
    const [name, ...description] = [...row.querySelectorAll("td span")]
      .map((span) => span.textContent.trim())
      .filter((content) => content.length > 1);
    return `- ${name}: ${description.join(", ")}`;
  })
  .join("\n");
```
