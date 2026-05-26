import { useState } from "react";
import { messageTeacher } from "../../services/parentService";

export default function TeacherMessaging() {
  const [activeTeacher, setActiveTeacher] = useState("helen");
  const [typedMessage, setTypedMessage] = useState("");
  const [chatLogs, setChatLogs] = useState({
    helen: [
      { sender: "teacher", text: "Hello! I wanted to check in regarding Daniel's physics performance. He started off great but is finding electromagnetism equations tricky." },
      { sender: "parent", text: "Thank you for reaching out Mrs. Helen. I noticed that too on his score trajectories. What study steps do you recommend?" },
      { sender: "teacher", text: "He should focus on mock topic unit 3 practice. I have also assigned a review test. Make sure he reviews the explanations!" }
    ],
    girmay: [
      { sender: "teacher", text: "Good afternoon! Daniel has been performing exceptionally well in his mathematics calculus tests. He maintains an 82% accuracy!" },
      { sender: "parent", text: "That is wonderful to hear! He spends a lot of time on the platform daily." }
    ]
  });

  const handleSend = async (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const currentTeacher = activeTeacher;
    const newMessage = { sender: "parent", text: typedMessage };

    // Update parent's typed log
    setChatLogs(prev => ({
      ...prev,
      [currentTeacher]: [...prev[currentTeacher], newMessage]
    }));
    
    const originalText = typedMessage;
    setTypedMessage("");

    try {
      await messageTeacher({ teacher: currentTeacher, message: originalText });
      
      // Simulate an automated follow-up response from the teacher after 1 second
      setTimeout(() => {
        const replyText = currentTeacher === "helen" 
          ? "Thank you for the update! I will monitor his practice sessions and send over more analytics soon."
          : "He is doing a great job! Keep encouraging him to maintain his 18-day streak.";
        
        setChatLogs(prev => ({
          ...prev,
          [currentTeacher]: [...prev[currentTeacher], { sender: "teacher", text: replyText }]
        }));
      }, 1000);

    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 840 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ color: "var(--navy)", marginBottom: 6 }}>Educator Communication Portal</h2>
        <p className="muted">Send messages to your children's active subject educators and class stream teachers.</p>
      </div>

      <div className="chat-container">
        {/* Contact Roster */}
        <div className="chat-roster">
          <div 
            className={`chat-roster-item ${activeTeacher === "helen" ? "active" : ""}`}
            onClick={() => setActiveTeacher("helen")}
          >
            <strong>Mrs. Helen Kassa</strong>
            <div className="muted" style={{ fontSize: 10 }}>Physics Educator</div>
          </div>
          <div 
            className={`chat-roster-item ${activeTeacher === "girmay" ? "active" : ""}`}
            onClick={() => setActiveTeacher("girmay")}
          >
            <strong>Mr. Girmay Belay</strong>
            <div className="muted" style={{ fontSize: 10 }}>Mathematics Educator</div>
          </div>
        </div>

        {/* Messaging Box */}
        <div className="chat-window">
          <div className="chat-header">
            💬 Chat with {activeTeacher === "helen" ? "Mrs. Helen Kassa (Physics)" : "Mr. Girmay Belay (Mathematics)"}
          </div>

          <div className="chat-messages">
            {chatLogs[activeTeacher].map((msg, idx) => (
              <div 
                key={idx} 
                className={`chat-bubble ${msg.sender === "parent" ? "sent" : "received"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form className="chat-input-wrap" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Type your message to the teacher..." 
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="btn primary" type="submit" style={{ padding: "10px 18px" }}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
