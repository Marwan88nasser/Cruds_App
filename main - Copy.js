// Cached App Element
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
let searchTitleBtn = document.querySelector("#btn_search_title");
let searchCategoryBtn = document.querySelector("#btn_search_category");
let deleteAllBtn = document.querySelector("#btn_delete_all");

// Total Price Of product
let totalPrice = document.querySelector("#total_price");
// Total Price Of product
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

// Get Total Price
let finalPrice = () => {
  if (!priceInp.value == "") {
    let Price = Number(priceInp.value) || 0;
    let tax = Number(taxesInp.value) || 0;
    let ads = Number(adsInp.value) || 0;
    let discount = Number(discountInp.value) || 0;

    let calcPrice = Price + tax + ads - discount;
    totalPrice.textContent = calcPrice;
  } else {
    totalPrice.textContent = "";
    Toast.fire({
      icon: "error",
      title: "Price must be added",
    });
  }
};

// Create product
// Create Array To Stor The Data
let dataProduct;
if (localStorage.product) {
  dataProduct = JSON.parse(localStorage.product);
} else {
  dataProduct = [];
}

let createProduct = () => {
  // Create Object To Stor The Signal Product Data
  let dataProductObj = {
    title: titleInp.value,
    price: priceInp.value,
    tax: taxesInp.value,
    ads: adsInp.value,
    discount: discountInp.value,
    count: countInp.value,
    category: categoryInp.value,
    total: totalPrice.textContent,
  };
  // Add Product Data Object To The Array
  if (dataProductObj.count > 1) {
    for (let i = 0; i < dataProductObj.count; i++) {
      dataProduct.push(dataProductObj);
    }
  } else {
    dataProduct.push(dataProductObj);
  }

  // Set Product Data Array To The LocalStorage
  localStorage.setItem("product", JSON.stringify(dataProduct));
};

// Clear Inputs
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

// Read Product
let viewProduct = () => {
  let tbody = "";

  if (dataProduct.length > 0) {
    dataProduct.forEach((item, index) => {
      tbody += `
        <tr>
          <td>${(index += 1)}</td>
          <td>${item.title}</td>
          <td>${item.price}</td>
          <td>${item.tax}</td>
          <td>${item.ads}</td>
          <td>${item.discount}</td>
          <td>${item.total}</td>
          <td>${item.category}</td>
          <td><button class="btn btn-sm px-4 btn-info">Update</button></td>
          <td><button class="btn btn-sm px-4 btn-danger" onclick="deleteProduct(${index})">Delete</button></td>
        </tr>
      `;
    });
    deleteAllBtn.style.display = "block";
    productNum.textContent = dataProduct.length;
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
// Run Function
viewProduct();

// Delete Product
let deleteProduct = (i) => {
  dataProduct.splice(--i, 1);
  localStorage.product = JSON.stringify(dataProduct);
  viewProduct();
};

// Delete All Product
let deleteAllPro = () => {
  dataProduct.splice(0);
  localStorage.removeItem("product");
  viewProduct();

  Toast.fire({
    icon: "success",
    title: "Deleted All Product Successfully",
  });
};

// Run Function
// Generate Product
createBtn.addEventListener("click", () => {
  createProduct();
  clearInputs();
  viewProduct();
});
