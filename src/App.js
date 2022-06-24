import './App.css';
const { ipcMain } = window.require('electron');

function App() {
  return (
    <div className="App">
      <form>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
export default App;

// function sendToBack(data) {
//   ipcRenderer.sendSync("main_channel", data);
// }
