import Switch from "./Switch";

const Card = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#FFA500",
      }}
    >
      <form
        className="card"
        style={{
          width: "400px",
          height: "500px",
          padding: "20px",
          backgroundColor: "#FF6347",
          borderRadius: "15px",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="card-body">
          <label className="form-label" htmlFor="InputEmail1">
            Email:
          </label>
          <input
            type="email"
            className="form-control"
            id="InputEmail1"
            placeholder="Enter your email"
            style={{
              borderRadius: "5px",
              padding: "10px",
              display: "flex",
              width: "300px",
              marginBottom: "10%",
            }}
          />
          <label className="form-label" htmlFor="InputPassword1">
            Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="InputPassword1"
            placeholder="Enter your password"
            style={{
              borderRadius: "5px",
              padding: "10px",
              display: "flex",
              width: "300px",
            }}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{
            width: "25%",
            height: "10%",
            borderRadius: "5px",
            marginTop: "10%",
            alignContent: "center",
          }}
        >
          Submit
        </button>
        <Switch />
      </form>
    </div>
  );
};

export default Card;