
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})


// get element by query selector
const getElement = className => document.querySelector('.' + className);

//search button click event
getElement('search-button').addEventListener('click', () => {
    const usersName = getElement('search-input').value;
    const regex = /[a-zA-Z]/;
    if (usersName.match(regex) && isNaN(usersName)) {
        getUsers(usersName);
    } else {
        getElement('users-area').innerHTML = '';//clear old users data
        getElement('main-title').innerText = 'Search by a name'
    }
});

//get all users
const getUsers = async users => {
    const response = await fetch(`https://api.github.com/search/users?q=${users}`);
    const data = await response.json();
    if(data.items.length){
        displayUsers(data.items);
    }else {
        getElement('users-area').innerHTML = '';//clear old users data
        getElement('main-title').innerText = `"${users}" related Users not fount! Try another users.`//not fount message
    }
};

//display all users
const displayUsers = users => {
    getElement('users-area').style.display = 'block';//show users area
    getElement('user-details').innerHTML = '';//clear previous user details
    getElement('main-title').innerText = 'users';//show users title
    getElement('users-area').innerHTML = '';//clear old users
    let usersRow = document.createElement('div');//create div for contain users
    usersRow.classList = 'row justify-content-between';// add class in div

    //loop for displaying all users
    users.forEach(user => {
        //add inner html in div
        usersRow.innerHTML += `
            <div class="col-md-6 col-lg-4 col-xl-3 p-md-3 d-flex justify-content-center">
                <div class="">
                    <div class="card m-3  justify-content-center" >
                      <div><a href="${user.html_url}" target="_blank"><img src="${user.avatar_url}" style="min-width: 270px; max-width: 280px" class="card-img-top" alt="..."></a></div>
                      <div class="card-body d-flex justify-content-between bg-secondary text-white align-items-center">
                        <h5 class="card-title text-capitalize">${user.login.length > 12 ? user.login.substring(0, 12) + '..' : user.login}</h5>
                        <button  onclick="getUserDetails('${user.url}')" class="btn bg-custom text-white">Details</button>
                      </div>
                    </div>
                </div>
            </div>
        `;

    })
    getElement('users-area').appendChild(usersRow);//append users div
    getElement('search-input').value = '';//clear search input value
};

//get details about user
const getUserDetails = async detailsUrl => {
    const response = await fetch(detailsUrl);
    const data = await response.json();
    displayUserDetails(data);
}

//display details about user
const displayUserDetails = user => {
    getElement('users-area').style.display = 'none';//hide all users
    getElement('main-title').innerText = 'user';//set title
    getElement('user-details').style.display = 'block';//show details section
    getElement('user-details').innerHTML = '';//clear previous data


    const userDiv = document.createElement('div');//create user details div
    userDiv.classList = 'row';//add class user details div
    userDiv.innerHTML = `
        <div class="">        
            <div class="card mb-3" >
              <div class="row align-items-center g-0">
                <div class=" col-md-4 col-xl-5">
                  <a href="${user.html_url}" target="_blank"><img style="width: 100%" src="${user.avatar_url}" alt="..."></a>
                </div>
                <div class="col-md-8  col-xl-7 ps-3">
                  <div class="card-body">
                    <h5 class="card-title text-capitalize">User Name: <a target="_blank" href="${user.html_url}"> ${user.login}</a></h5>
                    <p class="card-text">Type: ${user.type}</p>           
                    <p class="card-text">Id: ${user.id}</p>           
                    <p class="card-text">${user.bio ? 'Bio: ' + user.bio : ''}</p>           
                    <p class="card-text">Following: ${user.following }</p>           
                    <p class="card-text">Followers: ${user.followers }</p>           
                    <p class="card-text">${user.location ? 'Location: ' + user.location : ''}</p>           
                    <p class="card-text">Created At: <small class="text-muted">${moment(user.created_at).format("LLLL")}</small></p>
                    <div class="d-flex justify-content-center align-items-center">
                        <a href="https://twitter.com/${user.twitter_username}" target="_blank" class="card-text icon ${user.twitter_username ? 'bg-custom' : '' } text-white rounded-circle">${user.twitter_username ? '<i class="fab fa-twitter"></i>' : ''}</a>           
                        <a href="${user.html_url}" target="_blank" class="card-text icon bg-custom text-white rounded-circle ms-3"><i class="fab fa-github"></i></a> 
                    </div>          
                  </div>
                </div>
              </div>
            </div>
        </div>
            
     `;
         fetch(`${user.repos_url}`)
        .then(res => res.json())
        .then(data => {
            userDiv.innerHTML +=`
                <h2 class="text-center mt-3">Repositories</h2>
                <div class="table-responsive">
                    <table class="table table-striped ">
                          <thead class="bg-custom text-white">
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Name</th>
                              <th scope="col">Language</th>
                              <th scope="col">Clone URL</th>
                              <th scope="col">Updated </th>
                            </tr>
                          </thead>
                        <tbody>
                            ${data.length ? displayRepo(data) : ''}
                        </tbody>
                    </table>
                 </div>
                <div class="d-flex mb-5 justify-content-center align-items-center"> 
                    <button onclick="back()" class="btn bg-custom d-inline-block text-white">Back</button>
                </div>
            `;
        })

    getElement('user-details').appendChild(userDiv);//append user details div
}

//back button
const back = () => {
    getElement('user-details').style.display = 'none';//hide details section
    getElement('main-title').innerText = 'users';//set title
    getElement('users-area').style.display = 'block';//show all users
};

//display user repositories
const  displayRepo = data =>{
    let result = '';
    let count = 1;
    data.forEach(repo => {
        result+= `
        <tr>
          <th scope="row">${count}</th>
          <td><a href="${repo.html_url}" target="_blank">${repo.name}</a></td>
          <td>${repo.language}</td>
          <td class="d-flex justify-content-between align-items-center">
            <span class="clone-link">${repo.clone_url}</span>
            <button onclick="copy(event)" type="button" class="btn btn-sm text-white bg-custom d-inline-block"  title="Copy to clipboard">
              Copy
            </button>
           </td>
          <td>${moment(repo.updated_at).format('LLL')}</td>
        </tr>
        `;
        count++;
    })
    return result;
}

//onload
const  onloadCall = () =>{
    getUsers('hrdel');//default call
}

//copy git clone link
const copy = event =>{
    event.preventDefault();
    const cloneUrl = event.target.parentNode.firstElementChild.innerText;
    const input_temp = document.createElement("input");
    input_temp.value = cloneUrl;
    document.body.appendChild(input_temp);
    input_temp.select();
    const success = document.execCommand("copy");
    const msg = success ? 'Copied!' : 'Copy failed.';
    document.body.removeChild(input_temp);
    event.target.innerText = msg;
    setTimeout(()=>{
        event.target.innerText = 'Copy';
    },800)
}


