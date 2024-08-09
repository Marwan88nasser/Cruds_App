// Collect Used Variables
// Inputs
let titleInp = document.querySelector("#title_product");
let priceInp = document.querySelector("#price_product");
let taxesInp = document.querySelector("#taxes_product");
let adsInp = document.querySelector("#ads_product");
let discountInp = document.querySelector("#discount_product");
let countInp = document.querySelector("#count_product");
let categoryInp = document.querySelector("#category_product");
let searchInp = document.querySelector("#search_product");
// Buttons
let createBtn = document.querySelector("#btn-create");
let deleteAllBtn = document.querySelector("#btn_delete_all");
// Total Price Of product
let totalPrice = document.querySelector("#total_price");
// Number Of product
let productNum = document.querySelector("#product_number");

// Set Toast To The App
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

// Get Final Price
let finalPrice = () => {
  if (priceInp.value != "") {
    let priceVal = Number(priceInp.value) || 0;
    let taxesVal = Number(taxesInp.value) || 0;
    let adsVal = Number(adsInp.value) || 0;
    let discountVal = Number(discountInp.value) || 0;
    let calcPrice = priceVal + taxesVal + adsVal - discountVal;
    totalPrice.textContent = calcPrice;
  } else {
    totalPrice.textContent = "";
    Toast.fire({
      icon: "error",
      title: "Price must be added",
    });
  }
};

// Helpers Variables
let appState = "create";
let proIndex;
let productArr;

// Check If LocalStorage Have Data To Append For Product Array
if (localStorage.product) {
  productArr = JSON.parse(localStorage.product);
} else {
  productArr = [];
}

// Create Product Function
let createProduct = () => {
  // Create Object Of Product
  let productsObj = {
    title: titleInp.value,
    price: priceInp.value,
    taxes: taxesInp.value,
    ads: adsInp.value,
    discount: discountInp.value,
    total: totalPrice.textContent,
    count: countInp.value,
    category: categoryInp.value,
  };

  if (appState == "create") {
    if (productsObj.count > 1) {
      for (let i = 0; i < productsObj.count; i++) {
        // Rebate Product And Add To The Array
        productArr.push(productsObj);
      }
    } else {
      // Add Product To The Array
      productArr.push(productsObj);
    }
  } else if (appState == "update") {
    productArr[--proIndex] = productsObj;
    appState = "create";
    createBtn.textContent = "Create New Item";
    countInp.closest(".col-12").style.display = "block";
    Toast.fire({
      icon: "success",
      title: "The item has been updated successfully",
    });
  }

  // Add Product To The LocalStorage
  localStorage.setItem("product", JSON.stringify(productArr));
};

// View Clear Inputs Function
let clearInputs = () => {
  titleInp.value = "";
  priceInp.value = "";
  taxesInp.value = "";
  adsInp.value = "";
  discountInp.value = "";
  countInp.value = "";
  categoryInp.value = "";
  totalPrice.textContent = "";
};

// View Product Function
let viewProduct = () => {
  // Set Products To The Table
  let tbody = "";
  if (productArr.length > 0) {
    productArr.forEach((ele, index) => {
      tbody += `
        <tr>
          <td>${(index += 1)}</td>
          <td>${ele.title}</td>
          <td>${ele.price}</td>
          <td>${ele.taxes}</td>
          <td>${ele.ads}</td>
          <td>${ele.discount}</td>
          <td>${ele.total}</td>
          <td>${ele.category}</td>
          <td>
            <button class="btn btn-sm btn-info" onclick="updateProduct(${index})">Update</button>
          </td>
          <td>
            <button class="btn btn-sm btn-danger" onclick='deletePro(${index})'>Delete</button>
          </td>
        </tr>
        `;
    });
    productNum.textContent = productArr.length;
    deleteAllBtn.style.display = "block";
  } else {
    tbody = `
    <tr>
      <td colspan="12">There's No Product</td>
    </tr>
    `;
    deleteAllBtn.style.display = "none";
  }
  document.querySelector("#product-tbody").innerHTML = tbody;
};

// Run view Product Function
viewProduct();

// Delete Product Function
let deletePro = (i) => {
  // Delete The Product From The Array
  productArr.splice(--i, 1);
  // Update The localStorage Products
  localStorage.product = JSON.stringify(productArr);
  // Run view Product Function
  viewProduct();
  Toast.fire({
    icon: "success",
    title: "The item has been deleted successfully",
  });
};

// Delete All Products Function
let deleteAllPro = () => {
  // Delete The All Product From The Array
  productArr.splice(0);
  // Delete The localStorage Products Kye
  localStorage.removeItem("product");
  // Run view Product Function
  viewProduct();
  Toast.fire({
    icon: "success",
    title: "All items have been successfully deleted",
  });
};

// Update Product Function
let updateProduct = (i) => {
  appState = "update";
  createBtn.textContent = "Update The Item";
  proIndex = i;

  let updatingEle = productArr[--i];
  titleInp.value = updatingEle.title;
  priceInp.value = updatingEle.price;
  taxesInp.value = updatingEle.taxes;
  adsInp.value = updatingEle.ads;
  discountInp.value = updatingEle.discount;
  totalPrice.textContent = updatingEle.total;
  countInp.closest(".col-12").style.display = "none";
  categoryInp.value = updatingEle.category;

  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Search Function
let searchType = "";
let searchBy = (id) => {
  if (id == "search_title") {
    searchType = "title";
    searchInp.placeholder = "Search By Title...";
    searchInp.focus();
    document.querySelector("#search_category").classList =
      "btn btn-sm btn-outline-secondary fs-6 py-2 w-100";
    document.querySelector(`#${id}`).classList =
      "btn btn-sm btn-secondary fs-6 py-2 w-100";
  } else if (id == "search_category") {
    searchType = "category";
    searchInp.placeholder = "Search By Category...";
    searchInp.focus();
    document.querySelector("#search_title").classList =
      "btn btn-sm btn-outline-secondary fs-6 py-2 w-100";
    document.querySelector(`#${id}`).classList =
      "btn btn-sm btn-secondary fs-6 py-2 w-100";
  }
};

let searchProduct = (val) => {
  let tbody = "";
  if (searchType == "title") {
    productArr.forEach((ele, index) => {
      if (
        ele.title.includes(val.toUpperCase()) ||
        ele.title.includes(val.toLowerCase())
      ) {
        // Set Products To The Table
        tbody += `
      <tr>
        <td>${(index += 1)}</td>
        <td>${ele.title}</td>
        <td>${ele.price}</td>
        <td>${ele.taxes}</td>
        <td>${ele.ads}</td>
        <td>${ele.discount}</td>
        <td>${ele.total}</td>
        <td>${ele.count}</td>
        <td>${ele.category}</td>
        <td>
          <button class="btn btn-sm btn-info" onclick="updateProduct(${index})">Update</button>
        </td>
        <td>
          <button class="btn btn-sm btn-danger" onclick='deletePro(${index})'>Delete</button>
        </td>
      </tr>
      `;
      } else {
      }
    });
  } else if (searchType == "Category") {
    productArr.forEach((ele, index) => {
      if (
        ele.category.includes(val.toUpperCase()) ||
        ele.category.includes(val.toLowerCase())
      ) {
        // Set Products To The Table
        tbody += `
      <tr>
        <td>${(index += 1)}</td>
        <td>${ele.title}</td>
        <td>${ele.price}</td>
        <td>${ele.taxes}</td>
        <td>${ele.ads}</td>
        <td>${ele.discount}</td>
        <td>${ele.total}</td>
        <td>${ele.count}</td>
        <td>${ele.category}</td>
        <td>
          <button class="btn btn-sm btn-info" onclick="updateProduct(${index})">Update</button>
        </td>
        <td>
          <button class="btn btn-sm btn-danger" onclick='deletePro(${index})'>Delete</button>
        </td>
      </tr>
      `;
      } else {
      }
    });
  } else {
    val = " ";
    Toast.fire({
      icon: "warning",
      title: "You must choose a search method first",
    });
  }
  document.querySelector("#product-tbody").innerHTML = tbody;
};

// Run Create Product Function
createBtn.addEventListener("click", () => {
  // Run Create Product Function
  createProduct();
  // Run Clear Inputs Function
  clearInputs();
  // Run view Product Function
  viewProduct();

  Toast.fire({
    icon: "success",
    title: "The item has been added successfully",
  });
});
