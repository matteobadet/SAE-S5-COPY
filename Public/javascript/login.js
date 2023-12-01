const form = document.getElementById("formLogIn")

form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const data = JSON.stringify({
        "mail" : document.getElementById("mail").value,
        "psw" : document.getElementById("psw").value,
    });

    const response = await fetch('/login', {
        method: 'POST',
        headers:
        {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: data
    });
    
    const dataResponse = await response.json();

    var message = document.getElementById("errorMessageContainer");
    message.textContent = dataResponse["message"];

    if (dataResponse["success"]) 
    {
        document.location.href = "/";
    }

    return false;
})