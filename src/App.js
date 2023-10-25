import { useState, useEffect} from 'react'

const App = () => {
  const [ value, setValue] = useState(null)
  const [ message, setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [ currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    currentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body : JSON.stringify({
        message: value
      }),
      headers : {
        "Content-Type": "application/json"
      }
    }
    try {
        const response = await fetch('http://localhost:8000/completions', options)
        const data = await response.json()
        setMessage(data.choices[0].message)
    } catch (error) {
      console.error(error) 
    }

  }

  useEffect(() => {
       console.log(currentTitle, value, message)
       if(!currentTitle && value && message) {
        setCurrentTitle(value)
       }
       if (currentTitle && value && message) {
          setPreviousChats(prevChats => (
            [...prevChats, 
              {
                title: currentTitle,
                role: "user",
                content: value
               }, 
              {
                title: currentTitle,
                role: message.role,
                content:message.content
               }
          ]
          ))
       }
  }, [message, currentTitle]) 

  console.log(previousChats)

  const currenChat = previousChats.filter(previousChats => previousChats.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
  console.log(uniqueTitles)

  return (
    <div className="app">  
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat  </button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) =><li key={index} onClick={() => handleClick(uniqueTitle)}><svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M4 5.5H9C10.1046 5.5 11 6.39543 11 7.5V16.5C11 17.0523 10.5523 17.5 10 17.5H4C3.44772 17.5 3 17.0523 3 16.5V6.5C3 5.94772 3.44772 5.5 4 5.5ZM14 19.5C13.6494 19.5 13.3128 19.4398 13 19.3293V19.5C13 20.0523 12.5523 20.5 12 20.5C11.4477 20.5 11 20.0523 11 19.5V19.3293C10.6872 19.4398 10.3506 19.5 10 19.5H4C2.34315 19.5 1 18.1569 1 16.5V6.5C1 4.84315 2.34315 3.5 4 3.5H9C10.1947 3.5 11.2671 4.02376 12 4.85418C12.7329 4.02376 13.8053 3.5 15 3.5H20C21.6569 3.5 23 4.84315 23 6.5V16.5C23 18.1569 21.6569 19.5 20 19.5H14ZM13 7.5V16.5C13 17.0523 13.4477 17.5 14 17.5H20C20.5523 17.5 21 17.0523 21 16.5V6.5C21 5.94772 20.5523 5.5 20 5.5H15C13.8954 5.5 13 6.39543 13 7.5ZM5 7.5H9V9.5H5V7.5ZM15 7.5H19V9.5H15V7.5ZM19 10.5H15V12.5H19V10.5ZM5 10.5H9V12.5H5V10.5ZM19 13.5H15V15.5H19V13.5ZM5 13.5H9V15.5H5V13.5Z"
    fill="currentColor"
  />
</svg><p>{uniqueTitle}</p></li>)}
        </ul>
        <nav>
          <p>Made by<a href='https://jeremiah-coder.web.app/'> Jeremiah coder</a></p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>JeremyGpt</h1>}
        <ul className="feed">
          {currenChat?.map((chatMessage, index) => <li key={index}>
            <p className='role'>{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            
            <div id="submit"  onClick={getMessages}>➢</div>
          </div>
          <p className="info">
          Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT September 25 Version
          </p>
        </div>
      </section>
    </div>
  )
}

export default App;
