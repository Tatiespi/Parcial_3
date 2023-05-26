import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:3001");

function App() {
  // Estado de la sala
  const [room, setRoom] = useState("");

  // Estados de los mensajes
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [messages, setMessages] = useState([]);

  const unirseASala = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const enviarMensaje = () => {
    if (message !== "") {
      socket.emit("send_message", { message, room });
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
      setMessages((mensajesAnteriores) => [...mensajesAnteriores, data.message]);
    });

    return () => {
      socket.off("receive_message"); // Limpiar el evento al desmontar el componente
    };
  }, []);

  return (
    <div className="App">
      <div className="message-box">
        <h1> Mensajes:</h1>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <div className="input-box">
        <input
          placeholder="Número de Sala..."
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        />
        <button onClick={unirseASala}>Unirse a la Sala</button>
        <input
          placeholder="Mensaje..."
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <button onClick={enviarMensaje}>Enviar Mensaje</button>
      </div>
    </div>
  );
}

export default App;

