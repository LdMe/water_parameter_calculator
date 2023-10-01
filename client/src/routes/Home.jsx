import { FaLocationDot,FaRulerCombined,FaCalculator,FaPlus,FaUser,FaUserPlus,FaHouse,FaMagnifyingGlassChart} from "react-icons/fa6";

const Home = () => {

    return (
        <div className="info">
            <section className="title">
            <h2>
                Welcome to HydrOmnis!
            </h2>
            <p>Your app for saving water parameter values</p>
            </section>
            <section className="description">
                <h3>What is HydrOmnis?</h3>
                <p>HydrOmnis is an app for saving water parameter values. You can save the values of your water parameters for each location  (aquarium, pond, etc.) and calculate the color value of your water.</p>
                <h3>What are water parameters?</h3>
                <p>Water parameters are values that describe the water quality of your aquarium, pond, etc. These values are used to determine the water quality and to determine if changes are necessary.</p>
            </section>
            <section className="guide">
                <h3>How to use HydrOmnis</h3>
                <p>First you have to create a location. A location is a place where you measure the water parameters. For example an aquarium or a pond. Click on <FaLocationDot/></p>
                <p>After that you can create a parameter. A parameter is a water parameter. For example pH or nitrate. Click on <FaRulerCombined/></p>
                <p>Then you can add values to the parameter. For example the p value of your aquarium. Click on <FaCalculator/></p>
                <h3>How to create a Location</h3>
                <p>Click on <FaLocationDot/> and enter a name for your location. Then click on <FaPlus/>.</p>
                <h3>How to create a Parameter</h3>
                <p>Click on <FaRulerCombined/> and enter a name for your parameter.</p>
                <p>If the parameter doesn't have a color scale, uncheck the checkbox.</p>
                <p>If the parameter has a color scale, check the checkbox.</p>
                <p>If the parameter has a color scale, you can choose the color of the last value of the color scale.</p>
                <h4>Add color values</h4>
                <p>First you have to upload an image</p>
                <p>Then you can click on the image to pick a color.</p>
                <p>For better results, you should first pick the white color of the image. For that, you  must first click on "Pick white color" and then click on a white spot on the image.</p>
                <p>Once the colors are picked, you can enter the value of the color.</p>
                <p>Finally, click on save</p>
                <p>If you want to revert the values to the saved ones (it removes them if is not saved), you must click on reset</p>
                
            </section>


        </div>

    )

}

export default Home;