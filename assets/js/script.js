const baseUrl = 'https://northwind.vercel.app/api/products'

const table =  document.getElementById('tbody')
const pages =  document.querySelector('.pages')
let dataLength = 0;

const productName =  document.getElementById('name')
const quantity =  document.getElementById('quantity')
const price =  document.getElementById('price')
const stock =  document.getElementById('stock')

const create =  document.getElementById('create')

let view = 12


create.addEventListener('click',()=>{
    if (productName.value.trim() === '' || quantity.value.trim() === '' || price.value.trim() ==='' || stock.value.trim() === '' ) {
        return -1
    }
    add(productName.value,quantity.value,price.value,stock.value)
})

async function deletePost(id){
    await axios.delete(`${baseUrl}/${id}`)
    getData(view)
}
async function putPost(id,name,quantity,price,stock){
    await axios.put(`${baseUrl}/${id}`,{
        'name':name,
        'quantityPerUnit':quantity,
        'unitPrice':price,
        'unitsInStock':stock
    })
    getData(view)
}
async function getData(page) {
    const resp = await axios.get(baseUrl)
    table.innerHTML = ''
    console.log(resp.data.length);
    dataLength = resp.data.length
    for (let i = page-12; i < page; i++) {
        const element = resp.data[i];
        let row = document.createElement('tr')
        row.innerHTML = 
        `
        <tr>

        <td><input type="text" value="${element.name}" readonly></td>
        <td><input type="text" value="${element.quantityPerUnit}" readonly></td>
        <td><input type="text" value="${element.unitPrice}" readonly></td>
        <td><input type="text" value="${element.unitsInStock>0?element.unitsInStock:'Out of Stock' }" readonly></td>

        
        <button class="updatePost" data="${element.id}">Edit</button>
        <button class="deletePost" data="${element.id}">Delete</button>
        
        </tr>
        `
        table.append(row)
        
    }
    pages.innerHTML = ''
    let max = Math.ceil(resp.data.length/12)
    for (let index = 1; index <= max; index++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.textContent = index;
        pageLink.dataset.page = index * 12;

        pageLink.addEventListener('click', function () {
            view = parseInt(this.dataset.page);
            getData(view);
        });

        pages.appendChild(pageLink);
    }

    const removePost =  document.querySelectorAll('.deletePost')
    const updatePost =  document.querySelectorAll('.updatePost')

    removePost.forEach(element=>{
        element.addEventListener('click',()=>{
            deletePost(element.getAttribute('data'))
    })
    })

    updatePost.forEach(element=>{
        element.addEventListener('click',()=>{
            let nameInp = element.parentElement.firstElementChild.firstElementChild
            let quantityInp = nameInp.parentElement.nextElementSibling.firstElementChild
            let priceInp = quantityInp.parentElement.nextElementSibling.firstElementChild
            let stockInp = priceInp.parentElement.nextElementSibling.firstElementChild
            const arr = [nameInp,quantityInp,priceInp,stockInp]
            if (element.textContent === 'Edit') {
                arr.forEach(item => {
                    item.removeAttribute('readonly')
                });
                nameInp.focus()
                element.textContent = 'Save'
            }
            else{
                arr.forEach(item => {
                    item.setAttribute('readonly','')
                });
               
                putPost(element.getAttribute('data'),nameInp.value,quantityInp.value,priceInp.value,stockInp.value)
                element.textContent = 'Edit'
            }
            // element.getAttribute('data')
            // putPost(element.getAttribute('data'),productName.value,quantity.value,price.value,stock.value)
            
        })
    })

}

async function add(name,quantity,price,stock) {
    await axios.post(baseUrl,{
        'name':name,
        'quantityPerUnit':quantity,
        'unitPrice':price,
        'unitsInStock':stock
    })
}




// setInterval(() => {
//     getData()
// }, 1000);
getData(view)









