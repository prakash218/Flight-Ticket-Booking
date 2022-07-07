

async function view(id)
{
    var url = `https://prakash-flight.herokuapp.com//flights?id=${id}`;
    try
    {
        var response = await fetch(url);
        var data = await response.json();
        



        if(data)
        {
            var headDIV = document.getElementById("detailheader");

            var div = document.getElementById("results");
            div.innerHTML = "";
            headDIV.innerHTML = `
            <h2>${data[0].from_} → ${data[0].to_}</h2>
            <p><strong>Date : </strong>${data[0].date_} <strong>Time : </strong> ${data[0].time} <strong> Flight Name: </strong> ${data[0].name}</p>
            `

            headDIV.style.display = "block";

            for(var i = 0; i < data.length; i++)
            {

                var template = `<div class="card mb-3" style="max-width: 540px;">
                <div class="row no-gutters">
                  <div class="col-md-4">
                    <img src="static/img/ticket.jpg" class="card-img" alt="...">
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">User : ${data[i].booking_name}</h5>
                      <p class="card-text">
                      <strong>Tickets: </strong>${data[i].tickets} <br>
                      <strong>Price: </strong>Rs.${data[i].price} <br>
                      </p>
                    </div>
                  </div>
                </div>
              </div>`
                div.innerHTML += template;
            }
        }
    }
    catch(error)
    {
        console.log(error);
    }
}

function create_my_account_divs(data)
{
    var div = document.getElementById("account_container");
    div.innerHTML = "";
    for(var i = 0; i < data.length; i++)
    {
        if(data[i].from_ != undefined)
        {
            var template = `<div class="card mb-3" style="max-width: 540px;">
            <div class="row no-gutters">
              <div class="col-md-4">
                <img src="static/img/ticket.jpg" class="card-img" alt="...">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">${data[i].from_} → ${data[i].to_}</h5>
                  <p class="card-text">
                  <strong>Date:</strong> ${data[i].date_}   
                  <strong>Time:</strong> ${data[i].time}<br>
                  <strong>Flight Name: </strong>${data[i].name}<br>
                  <strong>Tickets: </strong>${data[i].tickets} <br>
                  <strong>Price: </strong>Rs.${data[i].price} <br>
                  </p>
                </div>
              </div>
            </div>
          </div>`
        }
        else
        {
            var template = `<div class="card mb-3" style="max-width: 540px;">
            <div class="row no-gutters">
              <div class="col-md-4">
                <img src="static/img/cancelled.png" class="card-img" alt="...">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">Cancelled</h5>
                  <p class="card-text">
                  <strong>Tickets: </strong>${data[i].tickets} <br>
                  <strong>Price: </strong>Rs.${data[i].price} <br>
                  <strong>Refund Initiated</strong> <br>
                  </p>
                </div>
              </div>
            </div>
          </div>`
        }
        div.innerHTML += template;
    }

}

async function my_account()
{
    var url = `https://prakash-flight.herokuapp.com//book`;

    try{
        var response = await fetch(url);
        var data = await response.json();
        console.log(data);
        if(data)
        {
            create_my_account_divs(data);
        }
        
    }
    catch(error) {
        console.log(error);
    }
}

async function book_flight(id, price, tickets)
{
    console.log('here');
    var modal = document.getElementById('myModal');
    modal.style.display = "block";

    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }

    var price_span = document.getElementById("price");
    var ticket_input = document.getElementById("number");

    var book_button = document.getElementById("confirm");

    book_button.onclick = async function() {
        var ticket = parseInt(ticket_input.value);
        if(ticket > tickets)
        {
            alert("Not enough tickets");
        }
        else
        {
            var url = `https://prakash-flight.herokuapp.com//book?id=${id}&ticket=${ticket}`;
            try
            {
                var response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id: id, ticket: ticket, price: price * ticket})
                });

                if (response) {
                    var data = await response.json();
                    console.log(data);
                    alert("Flight booked successfully");
                    modal.style.display = "none";
                }
                else {
                    alert("Error booking flight");
                    modal.style.display = "none";
                }
                location.reload();
            }
            catch(error)
            {
                console.log(error);
                modal.style.display = "none";
            }
        }
    }

    // ticket_input.onchange = function()
    // {
    //     console.log(ticket_input.value, price);
    //     var cost = parseInt(price) * parseInt(ticket_input.value);
    //     price_span.innerHTML = "Price : Rs. " + cost;
    // }

    ticket_input.addEventListener('input', function() {
        console.log(ticket_input.value, price);
        var cost = parseInt(price) * (parseInt(ticket_input.value) || 0);
        price_span.innerHTML = "Price : Rs. " + cost;
    });

}

async function remove_flight(id)
{
    if(confirm("Are you sure you want to delete this?"))
    {
        var url = `https://prakash-flight.herokuapp.com//remove?id=${id}`;
        try
        {
            var response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: id})
            });

            if (response) {
                var data = await response.json();
                console.log(data);
                alert("Flight deleted successfully");
            }
            else {
                alert("Error deleting flight");
            }
        }
        catch(error)
        {
            console.log(error);
        }
    }
    else
    {
        return;
    }
}

function create_divs(data, op)
{
    var div = document.getElementById("results");
    div.innerHTML = "";
    for(var i = 0; i < data.length; i++)
    {
        if(op == "search")
        {
            const date = data[i]['date'].split(/(\s+)/);
            var template = `<div class="card" style="width: 18rem;">
            <img class="card-img-top" src="static/img/flight.jpg" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">${data[i]['from_']} → ${data[i]['to_']}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Rs.${data[i].price}</h6>
              <p class="card-text">Flight Name : ${data[i]['name']}</p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Date : ${date[0]}</li>
              <li class="list-group-item">Time : ${data[i]['time']}</li>
              <li class="list-group-item">Tickets : ${data[i]['tickets']}</li>
            </ul>
            
            <div class="card-body">
                <button class="btn btn-dark" onclick="book_flight(${data[i].id},${data[i].price}, ${data[i].tickets})">Book</button>
            </div>
          </div>`
        }
        else if(op == "remove")
        {
            const date = data[i]['date'].split(/(\s+)/);
            var template = `<div class="card" style="width: 18rem;">
            <img class="card-img-top" src="static/img/flight.jpg" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">${data[i]['from_']} → ${data[i]['to_']}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Rs.${data[i].price}</h6>
              <p class="card-text">Flight Name : ${data[i]['name']}</p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Date : ${date[0]}</li>
              <li class="list-group-item">Time : ${data[i]['time']}</li>
              <li class="list-group-item">Tickets : ${data[i]['tickets']}</li>
            </ul>
            
            <div class="card-body">
                <button class="btn btn-dark" onclick="remove_flight(${data[i]['id']})">Remove</button>
            </div>
          </div>`
        }
        else if(op == "view")
        {
            headDIV = document.getElementById("detailheader");
            headDIV.style.display = "none";
            const date = data[i]['date'].split(/(\s+)/);
            var template = `<div class="card" style="width: 18rem;">
            <img class="card-img-top" src="static/img/flight.jpg" alt="Card image cap">
            <div class="card-body">
              <h5 class="card-title">${data[i]['from_']} → ${data[i]['to_']}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Rs.${data[i].price}</h6>
              <p class="card-text">Flight Name : ${data[i]['name']}</p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Date : ${date[0]}</li>
              <li class="list-group-item">Time : ${data[i]['time']}</li>
              <li class="list-group-item">Tickets : ${data[i]['tickets']}</li>
            </ul>
            
            <div class="card-body">
                <button class="btn btn-dark" onclick="view(${data[i]['id']})">View</button>
            </div>
          </div>`
        }

      div.innerHTML += template;
    }
}

async function search(op)
{
    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;
    var date = document.getElementById("date").value;
    

    var url = `https://prakash-flight.herokuapp.com//search?from=${from || " "}&to=${to || " "}&date=${date || " "}`;
    
    var body = 
    {
        from: from || " ",
        to: to || " ",
        date: date || " "
    }
    console.log(body);
    try{
        var response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response) {
            var data = await response.json();
            console.log(data);
            if(data)
            {
                create_divs(data, op);
            }

            
        }
    
    }
    catch(error) {
        console.log(error);
    }
}


async function create_flight()
{
    var name = document.getElementById("name").value;
    var from = document.getElementById("from").value;
    var to = document.getElementById("to").value;
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;
    var price = document.getElementById("price").value;

    var url = `https://prakash-flight.herokuapp.com//create_flight?name=${name}&from=${from}&to=${to}&date=${date}&time=${time}&price=${price}`;
    var flight = {
        name: name,
        from: from,
        to: to,
        date: date,
        time: time,
        price: price
    };

    try{
        var response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flight)
        });

        if (response) {
            var data = await response.json();
            console.log(data);
            alert("Flight created successfully");
        }
        else {
            alert("Error creating flight");
        }
    }
    catch(error) {
        console.log(error);
    }

    // create api call
    
}