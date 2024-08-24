import { useState } from "react";
import "./App.css";
import { BarcodeScanner } from "@thewirv/react-barcode-scanner";

const insertData = async (timeType, barcodeData, time) => {
  console.log(`Hitting ${timeType} for roll number ${barcodeData} at ${time}`);

  if (timeType === "in_time") {
    try {
      const response = {
        data: {
          data: [
            {
              roll: barcodeData,
              in_time: time,
            },
          ],
        },
      };
      const inData = { roll: barcodeData, in_time: time };
      console.log("Checked in:", inData);
      // await axios.post(BASE_URL, inData); 
    } catch (error) {
      console.error("Error in in_time processing:", error);
    }
  } else if (timeType === "out_time") {
    try {
      
      const response = {
        data: {
          data: [
            {
              roll: barcodeData,
              in_time: "2024-08-22T08:00:00Z", 
            },
          ],
        },
      };
      const res = response.data;

      if (res.data.length > 0) {
        const inTime = res.data[0].in_time;
        const timeSpent = (new Date(time) - new Date(inTime)) / 60000; 

        console.log("Checked out:", { roll: barcodeData, out_time: time });
        console.log(`Time spent: ${timeSpent} minutes`);
        // await axios.patch(`${BASE_URL}/${id}`, outData); 
        return timeSpent; 
      } else {
        console.log(`No record found for roll number ${barcodeData} to check out`);
      }
    } catch (error) {
      console.error("Error in out_time processing:", error);
    }
  }
};

function App() {
  const [data, setData] = useState("No result");
  const [timeType, setTimeType] = useState("in_time");
  const [timeSpent, setTimeSpent] = useState(null);

  const handleSuccess = async (barcodeData) => {
    console.log("Barcode scanned:", barcodeData);
    setData(barcodeData);

    const time = new Date().toISOString();
    const spentTime = await insertData(timeType, barcodeData, time);

    if (timeType === "out_time" && spentTime !== undefined) {
      if (spentTime > 60) {
        const hours = Math.floor(spentTime / 60);
        const minutes = Math.floor(spentTime % 60);
        setTimeSpent(`${hours} hours and ${minutes} minutes`);
      } else {
        setTimeSpent(`${Math.floor(spentTime)} minutes`);
      }
    }

  
    setTimeType((prevType) => (prevType === "in_time" ? "out_time" : "in_time"));
  };

  return (
    <div className="app-container" style={{ textAlign: "center", paddingTop: "50px" }}>
      <h1>Attendance System</h1>
      <div className="scanner-container" style={{ display: "inline-block" }}>
        <BarcodeScanner
          onSuccess={handleSuccess}
          onError={(error) => console.error(error)}
          onLoad={() => console.log("Video feed has loaded!")}
          containerStyle={{ width: "500px", margin: "0 auto", display: "inline-block" }}
        />
        <div>
          <p className="result-text">Roll Number: {data}</p>
          <p className="result-text">
            Status: {timeType === "in_time" ? "Checking in..." : "Checking out..."}
          </p>
          {timeSpent !== null && (
            <p className="result-text">
              Time Spent: {timeSpent}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
