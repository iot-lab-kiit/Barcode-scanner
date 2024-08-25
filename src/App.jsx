import { useState, useEffect } from "react";
import "./App.css";
import { BarcodeScanner } from "@thewirv/react-barcode-scanner";
import { Scanner } from "@yudiel/react-qr-scanner";

// Function to insert data for check-in and check-out

function App() {
  const [data, setData] = useState("No result");
  const [timeType, setTimeType] = useState("in_time");
  const [timeSpent, setTimeSpent] = useState(null);
  const [checkStatus, setCheckedStatus] = useState("None");
  // Auto check-out at 9 PM
  useEffect(() => {
    const autoCheckout = () => {
      const currentHour = new Date().getHours();
      if (currentHour === 21) {
        // 9 PM in 24-hour format
        handleAutoCheckout();
      }
    };

    const intervalId = setInterval(autoCheckout, 60000); // Check every minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const insertData = async (timeType, barcodeData, time) => {
    console.log(
      `Processing ${timeType} for roll number ${barcodeData} at ${time}`
    );

    try {
      if (timeType === "in_time") {
        const inData = { roll: barcodeData, in_time: time };
        console.log("Checked in:", inData);
        setCheckedStatus("Checked In");
        // Simulate storing in_time in backend/cache
        // await axios.post(BASE_URL, inData); // Uncomment when integrating with backend
      } else if (timeType === "out_time") {
        // Simulate fetching check-in time from backend or cache memory
        const response = {
          data: {
            data: [
              {
                roll: barcodeData,
                in_time: "2024-08-25T13:00:00.000Z", // Simulated realistic check-in time
              },
            ],
          },
        };

        const res = response.data;

        if (res.data.length > 0) {
          const inTime = res.data[0].in_time;
          const millTime = new Date(time).getMilliseconds();
          const millInTime = new Date(inTime).getMilliseconds();
          const timeSpent = new Date(millTime - millInTime); // Time spent in minutes

          console.log("Checked out:", { roll: barcodeData, out_time: time });
          setCheckedStatus("Checked Out");
          console.log(`Time spent: ${timeSpent} minutes`);
          // await axios.patch(`${BASE_URL}/${barcodeData}`, { out_time: time, duration: timeSpent }); // Uncomment for backend
          return timeSpent;
        } else {
          console.log(
            `No record found for roll number ${barcodeData} to check out`
          );
          setCheckedStatus("No record found");
        }
      }
    } catch (error) {
      console.error(`Error processing ${timeType}:`, error);
    }
  };

  const handleAutoCheckout = async () => {
    const time = new Date().toISOString();
    // Assuming you have a list of users who haven't checked out, loop through them
    // const users = [...]; // Get users from cache or backend
    // for (let user of users) {
    //   await insertData("out_time", user.roll, time); // Automatically check out users
    // }
    console.log(`Auto check-out at ${time}`);
  };

  const handleSuccess = async (barcodeData) => {
    console.log("Barcode scanned:", barcodeData);
    setData(barcodeData);

    const time = new Date().toISOString(); // Automatically captures the current time from the browser
    const spentTime = await insertData(timeType, barcodeData, time);

    if (timeType === "out_time" && spentTime !== undefined) {
      setTimeSpent(
        spentTime > 60
          ? `${Math.floor(spentTime / 60)} hours and ${Math.floor(
              spentTime % 60
            )} minutes`
          : `${Math.floor(spentTime)} minutes`
      );
    }

    setTimeType((prevType) =>
      prevType === "in_time" ? "out_time" : "in_time"
    );
  };

  return (
    <div
      className="app-container"
      style={{ textAlign: "center", paddingTop: "50px" }}
    >
      <h1>Attendance System</h1>
      <div className="scanner-container" style={{ display: "inline-block" }}>
        {/* <BarcodeScanner
          onSuccess={handleSuccess}
          onError={(error) => console.error(error)}
          onLoad={() => console.log("Video feed has loaded!")}
          containerStyle={{
            width: "500px",
            margin: "0 auto",
            display: "inline-block",
          }} */}
        {/* /> */}
        <Scanner
          onScan={(result) => {
            handleSuccess(result[0].rawValue);
          }}
          formats={["code_128"]}
          components={{
            audio: true,
            // onOff: true,
            torch: true,
            zoom: true,
            finder: true,
          }}
          allowMultiple={true}
          scanDelay={2000}
          styles={{
            container: {
              width: "400px",
              margin: "0 auto",
              display: "inline-block",
            },
          }}
        />
        ;
        <div>
          <p className="result-text">Roll Number: {data}</p>
          <p className="result-text">Status: {checkStatus}</p>
          {timeSpent !== null && (
            <p className="result-text">Time Spent: {timeSpent}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
