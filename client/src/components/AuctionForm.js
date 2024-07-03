import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function AuctionForm() {
    const [vehicleBrand, setVehicleBrand] = useState("Alfa Romeo")
    const [vehicleDriveTrain, setVehicleDriveTrain] = useState("RWD")
    const [vehicleModel, setVehicleModel] = useState("")
    const [models, setModels] = useState([])
    const [vehicleTransmission, setVehicleTransmission] = useState("M/T")
    const [imageOne, setImageOne] = useState("")
    const [imageTwo, setImageTwo] = useState("")
    const [imageThree, setImageThree] = useState("")
    const [imageFour, setImageFour] = useState("")
    const [imageFive, setImageFive] = useState("")
    const [reserve, setReserve] = useState("")
    const navigate = useNavigate()

    const brands = [
        "Alfa Romeo",
        "Aston Martin",
        "Audi",
        "Bentley",
        "BMW",
        "Bugatti",
        "Cadillac",
        "Chevrolet",
        "Chrysler",
        "Daewoo",
        "Daihatsu",
        "Dodge",
        "DS",
        "Ferrari",
        "Fiat",
        "Fisker",
        "Ford",
        "Honda",
        "Hummer",
        "Hyundai",
        "Infiniti",
        "Iveco",
        "Jaguar",
        "Jeep",
        "Kia",
        "KTM",
        "Lamborghini",
        "Lancia",
        "Land Rover",
        "Lexus",
        "Lotus",
        "Maserati",
        "Maybach",
        "Mazda",
        "McLaren",
        "Mercedes-Benz",
        "MG",
        "Mini",
        "Mitsubishi",
        "Morgan",
        "Nissan",
        "Opel",
        "Peugeot",
        "Porsche",
        "Rolls-Royce",
        "Rover",
        "Saab",
        "Smart",
        "Subaru",
        "Suzuki",
        "Tesla",
        "Toyota",
        "Volkswagen",
        "Volvo"
    ]



    const handleVehicleBrand = (event) => { 
        const selectedValue = event.target.value;
        setVehicleBrand(selectedValue);
    }   
    const handleVehicleModel = (event) => { 
        const selectedValue = event.target.value;
        setVehicleModel(selectedValue);
    }
    const handleVehicleDriveTrain = (event) => { 
        const selectedValue = event.target.value;
        setVehicleDriveTrain(selectedValue);
    }
    const handleVehicleTransmission = (event) => { 
        const selectedValue = event.target.value;
        setVehicleTransmission(selectedValue);
    }  
    useEffect(() => {
        fetch(`/auctionform`)
        .then((resp) => {
            if (resp.status == 401) {
                navigate('/login')
                alert('User Must Be Logged In')
            }
        })
        
    }, [])
    
    function handleSubmit(e){
        e.preventDefault()
    
        fetch(`/auctionform`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(vehicleInformation)
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            navigate('/login')
        })
    }

    const vehicleBrands = brands.map((brand) => (
        <option className="brand" key={brand} 
        id={brand} label={brand} value={brand}>{brand}</option>
    ))


    
    useEffect(() => {
        fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${vehicleBrand}?format=json`)
        .then((resp) => resp.json())
        .then((vehicleModelData) => {
            setModels(vehicleModelData["Results"])
            console.log(models)
        })
    }, [vehicleBrand])
    
    let vehicleModels = models.map((model) => ( 
        <option className="model" key={model.Model_Name} 
        id={model.Model_Name} label={model.Model_Name} value={model.Model_Name}>{model.Model_Name}</option>
    ))
    
    const vehicleInformation = {
        brand: vehicleBrand,
        model: vehicleModel,
        drivetrain: vehicleDriveTrain,
        transmission: vehicleTransmission,
        reserve : reserve,
        image_one : imageOne,
        image_two : imageTwo,
        image_three : imageThree,
        image_four : imageFour,
        image_five : imageFive
    }
    console.log(vehicleInformation)
    return (
        <div className="auctionBg">
            <h1 id="auctionHeading">🏁 Enter Vehicle Information and Publish Vehicle 🏁</h1>
            <div className="auctionBox">
                
                <form id="form" onSubmit={handleSubmit}>
                    <label className="label" for="cars">Vehicle Brand:</label>
                    <select id="cars" className="auctionInput" onChange={handleVehicleBrand}>
                        {vehicleBrands}
                    </select>
                    <br></br>
                    <label className="label" for="model">Vehicle Model:</label>
                    <br></br>
                    <select id="model" className="auctionInput" onChange={handleVehicleModel}>
                        {vehicleModels}
                    </select>
                    <br></br>
                    <label className="label" for="driveTrain">Drive Train:</label>
                    <select id="driveTrain" className="auctionInput" onChange={handleVehicleDriveTrain}>
                        <option label="RWD (Rear Wheel Drive)">RWD</option>
                        <option label="FWD (Front Wheel Drive)">FWD</option>
                        <option label="4WD (Four Wheel Drive)">4WD</option>
                        <option label="AWD (All Wheel Drive)">AWD</option>
                    </select>

                    <label className="label" for="transmission">Transmission:</label>
                    <select id="transmission" className="auctionInput" onChange={handleVehicleTransmission}>
                        <option label="Manual Transmission">M/T</option>
                        <option label="Automatic Transmission">A/T</option>
                    </select>
                    <label className="label">Image URL's:</label>
                    <input id="imageOne"placeholder="Image One..." type="text" className="formInput" value={imageOne}  onChange={(e) => setImageOne(e.target.value)} required></input>
                    <input placeholder="Image Two..." type="text" className="formInput" value={imageTwo}  onChange={(e) => setImageTwo(e.target.value)} required></input>
                    <input placeholder="Image Three..." type="text" className="formInput" value={imageThree}  onChange={(e) => setImageThree(e.target.value)} required></input>
                    <input placeholder="Image Four..." type="text" className="formInput" value={imageFour}  onChange={(e) => setImageFour(e.target.value)} required></input>
                    <input placeholder="Image Five..." type="text" className="formInput" value={imageFive}  onChange={(e) => setImageFive(e.target.value)} required></input>
                    <input placeholder="Set Reserve..." type="text" className="formInput" value={reserve}  onChange={(e) => setReserve(e.target.value)} required></input>
                    <input className="loginButton" type="submit" value="Publish Vehicle" ></input>
                </form>
            </div>
        </div>
    )
}

export default AuctionForm