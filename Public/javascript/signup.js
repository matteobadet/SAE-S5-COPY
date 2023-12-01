const form = document.getElementById("formSignUp")

form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const ata = JSON.stringify({
        "mail": document.getElementById("mail").value,
        "psw": document.getElementById("psw").value,
        "psw2": document.getElementById("psw2").value,
        "pseudo": document.getElementById("pseudo").value,
        "g-recaptcha-response": grecaptcha.getResponse()
    });
    const response = await fetch('/signup', {
        method: 'POST', headers:
        {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }, body: ata
    });
    const data = await response.json();

    var message = document.getElementById("errorMessageContainer");
    message.textContent = data["message"];

    if (data["success"]) {
        document.location.href = "/";
    }

    return false;
})