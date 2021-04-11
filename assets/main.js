const onSubmit = (event) => {
  event.preventDefault();
  console.log("onSubmit");
};
$("#search-by-city-form").on("submit", onSubmit);
