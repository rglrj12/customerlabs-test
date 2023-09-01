import "./App.css";
import { useState } from "react";
import Modal from "react-modal";

function App() {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchema, setSelectedSchema] = useState("");
  const [schemaOptions, setSchemaOptions] = useState([
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" },
  ]);
  const [selectedSchemas, setSelectedSchemas] = useState([]);

  const weburl = "https://webhook.site/4c40d513-a7bd-4c10-9426-e6adf8edac6d";
  const handleSaveSegment = () => {
    const formattedSchema = selectedSchemas.map((schema) => ({
      [schema.value]: schema.label,
    }));

    // Prepare the data to be sent to the server
    const data = {
      segment_name: segmentName,
      schema: formattedSchema,
    };
    console.log(data);

    fetch(
      weburl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
      { mode: "no-cors" }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("Server response:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    setIsOpen(false);
  };

  const handleAddNewSchema = () => {
    if (
      selectedSchema &&
      !selectedSchemas.find((schema) => schema.value === selectedSchema)
    ) {
      const newSchema = schemaOptions.find(
        (option) => option.value === selectedSchema
      );
      setSelectedSchemas([...selectedSchemas, newSchema]);
      setSchemaOptions(
        schemaOptions.filter((option) => option.value !== selectedSchema)
      );
      setSelectedSchema("");
    }
    console.log(selectedSchemas);
  };

  const renderSchemaDropdowns = () => {
    return selectedSchemas.map((schema, index) => (
      <div key={index}>
        <select
          value={schema.value}
          onChange={(e) => handleSchemaChange(index, e)}
        >
          <option value={schema.value}>{schema.label}</option>
          {schemaOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    ));
  };

  const handleSchemaChange = (index, event) => {
    const updatedSchemas = [...selectedSchemas];
    updatedSchemas[index].value = event.target.value;
    setSelectedSchemas(updatedSchemas);
  };

  return (
    <div className="App">
      <button onClick={() => setIsOpen(true)} className="save__segment">
        Save segment
      </button>

      <Modal isOpen={modalIsOpen} ariaHideApp={false}>
        <div className="tab__">Saving segment</div>
        <div className="modal__">
          <span className="input__">
            <label>Enter the Name of the Segment</label>
            <input
              type="text"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              placeholder="Name of the segment"
            />
            <p>To save your segment, you need to add schemas to the query</p>
          </span>

          {selectedSchemas.length > 0 && (
            <div className="bluebox__">{renderSchemaDropdowns()}</div>
          )}

          <select
            value={selectedSchema}
            onChange={(e) => setSelectedSchema(e.target.value)}
          >
            <option value="">Add schema to segment</option>
            {schemaOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <a onClick={handleAddNewSchema}>+ Add new schema</a>

          <div className="buttons__">
            <button onClick={handleSaveSegment} className="save_the_segment__">
              Save the segment
            </button>
            <button onClick={() => setIsOpen(false)} className="close__">
              close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
