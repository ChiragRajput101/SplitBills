import "./App.css";
import { useState } from "react";

const friendData = [
  {
    id: 1,
    name: "Yo Yo Honey",
    image: "./images/photo1.jpg",
    balance: 0,
  },

  {
    id: 2,
    name: "Herolal",
    image: "./images/photo1.jpg",
    balance: -10,
  },

  {
    id: 3,
    name: "Shinchan",
    image: "./images/photo1.jpg",
    balance: 100,
  },
];

// we need to sync the left and right section now

export default function App() {
  const dummyFriends = friendData;

  const [selectedFriend, setFriendSelected] = useState(null);
  const [friends, setFriends] = useState(dummyFriends);

  function handleFriendSelection(friend) {
    setFriendSelected((curr) => (curr?.id === friend.id ? null : friend));
  }

  function handleAddFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]); // using state upd rather tahn simpling pushing in the new friend's data as react is all abt immutablity
  }

  function handleSplitBill(val) {
    setFriends((friends) =>
      friends.map((x) =>
        x.id === selectedFriend.id ? { ...x, balance: x.balance + val } : x
      )
    );

    setFriendSelected(null);
  }

  return (
    <div className="main-container">
      <LeftSection
        onFriendSelection={handleFriendSelection}
        selectedFriend={selectedFriend}
        friends={friends}
        onAddFriend={handleAddFriend}
      />
      {selectedFriend && (
        <RightSection
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

// ------------------------------------------------------------------------------------------------------------------------

function LeftSection({
  onFriendSelection,
  selectedFriend,
  friends,
  onAddFriend,
}) {
  const [isFormRendered, setIsFormRendered] = useState(false);

  function handleFormRender() {
    setIsFormRendered((isFormRendered) => !isFormRendered);
  }

  return (
    <div className="left-section">
      {/* rendering a friend list */}
      {friends.map((friend) => (
        <Friend
          propObj={friend}
          onFriendSelection={onFriendSelection}
          selectedFriend={selectedFriend}
        />
      ))}

      {isFormRendered && <FormAddFriend onAddFriend={onAddFriend} />}

      <button onClick={handleFormRender}>
        {isFormRendered ? "Close" : "Add Friend"}
      </button>
    </div>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");

  // onSubmit recieves the event object as the parameter

  function handleFormSubmit(e) {
    e.preventDefault(); // we dont want to reload the entire page upon submit

    if (!name) return;
    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      balance: 0,
    };

    console.log(newFriend);
    onAddFriend(newFriend);

    setName(""); // resetting after the form has been submitted
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <label for="fname">Name:</label>
      <br></br>
      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br></br>
      <button>Add</button>
    </form>
  );
}

function Friend({ propObj, onFriendSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === propObj.id ? true : false;

  return (
    <div className="friend-attribute">
      <img src={propObj.image} height="50px" width="50px" alt=""></img>

      {/* conditional rendering of the decr based on the balance */}

      {propObj.balance > 0 && (
        <div className="green">
          <h4>{propObj.name}</h4>
          <p>
            {propObj.name} owes you {propObj.balance}
          </p>
        </div>
      )}

      {propObj.balance < 0 && (
        <div className="red">
          <h4>{propObj.name}</h4>
          <p>
            You owe {propObj.name} {Math.abs(propObj.balance)}
          </p>
        </div>
      )}

      {propObj.balance === 0 && (
        <div className="neutral">
          <h4>{propObj.name}</h4>
          <p>You are even</p>
        </div>
      )}

      <button
        onClick={() => {
          // console.log(propObj);
          return onFriendSelection(propObj);
        }}
      >
        {isSelected ? "Close" : "Select"}
      </button>
    </div>
  );
}

// --------------------------------------------------------------------------------------------------------------------

function RightSection({ selectedFriend, onSplitBill }) {
  return (
    <div className="right-section">
      <FormSplitBill
        selectedFriend={selectedFriend}
        onSplitBill={onSplitBill}
      />
    </div>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [billVal, setBillVal] = useState(null);
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const paidByFriend = billVal ? billVal - paidByUser : "";

  function handleSubmit(e) {
    e.preventDefault();
    onSplitBill(
      whoIsPaying === "user"
        ? Number(paidByFriend)
        : Number(paidByFriend - billVal)
    );
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split Your Bill with {selectedFriend?.name}</h2>

      <label>Bill Value</label>
      <input
        type="text"
        value={billVal}
        onChange={(e) => setBillVal(Number(e.target.value))}
      />
      <br></br>

      <label>Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) => setPaidByUser(Number(e.target.value))}
      />
      <br></br>

      <label>{selectedFriend?.name}'s Expense</label>
      <input type="text" disabled value={paidByFriend} />
      <br></br>

      <label>Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option vlaue="friend">Them</option>
      </select>
      <br></br>
      <button>Split</button>
    </form>
  );
}
