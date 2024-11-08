import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import "./App.css";

interface Resource {
  id: string;
  name: string;
  type: string;
  status: string;
}

const GET_RESOURCES = gql`
  query GetResources($search: String) {
    resources(search: $search) {
      id
      name
      status
      type
    }
  }
`;

const ADD_RESOURCE = gql`
  mutation AddResource($name: String!, $type: String!, $status: String!) {
    addResource(name: $name, type: $type, status: $status) {
      id
      name
      status
      type
    }
  }
`;

const RESOURCE_ADDED = gql`
  subscription OnResourceAdded {
    resourceAdded {
      id
      name
      status
      type
    }
  }
`;

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const { data, loading, refetch } = useQuery(GET_RESOURCES, {
    variables: { search: searchTerm },
  });

  const [addResource] = useMutation(ADD_RESOURCE);

  const { data: subscriptionData } = useSubscription(RESOURCE_ADDED);

  useEffect(() => {
    if (subscriptionData) {
      refetch();
    }
  }, [subscriptionData, refetch]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddResource = async () => {
    try {
      await addResource({
        variables: { name, type, status },
      });
      setName("");
      setType("");
      setStatus("");
      refetch();
    } catch (error) {
      console.error("Error adding resource:", error);
    }
  };

  return (
    <div className="app">
      <h1>Resource Manager</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="resource-list">
        {loading ? (
          <p>Loading resources...</p>
        ) : (
          data?.resources.map((resource: Resource) => (
            <div key={resource.id} className="resource-item">
              <h3>{resource.name}</h3>
              <p>{resource.type}</p>
              <p>Status: {resource.status}</p>
            </div>
          ))
        )}
      </div>

      <div className="resource-form">
        <h2>Add New Resource</h2>
        <input
          type="text"
          placeholder="Resource Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Resource Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="form-select"
        >
          <option value="">-- Select status --</option>
          <option value="Active">Active</option>
          <option value="In-active">In Active</option>
          <option value="Running">Running</option>
          <option value="Stopped">Stopped</option>
        </select>

        <button onClick={handleAddResource}>Add Resource</button>
      </div>
    </div>
  );
};

export default App;
