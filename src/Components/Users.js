import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { toggleColumnVisibility } from "../Redux/Action";

const ColumnVisibilityModal = ({ columnsVisibilityprop, toggleColumnVisibility, closeModal }) => {
  const handleChange = (column) => {
    toggleColumnVisibility(column);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h4>Toggle Column</h4>
        <ul>
          {Object.keys(columnsVisibilityprop).map((column) => (
            <li key={column}>
              <label>
                <input
                  type="checkbox"
                  checked={columnsVisibilityprop[column]}
                  onChange={() => handleChange(column)}
                />
                {column}
              </label>
            </li>
          ))}
        </ul>
        <button 
         style={{padding:"0.3rem 1rem 0.3rem 1rem",marginLeft:"10%",backgroundColor:"white",color:"black",fontWeight:"bold"}}
         onClick={closeModal}>confirm
        </button>
      </div>
    </div>
  );
};




const Users = () => {
   const [userList , setUserList] = useState([]);
   const [search, setSearch] = useState([]);
   const [page, setPage] = useState(2);
   const [isAscending, setIsAscending ] = useState(true);
  const [showModal, setShowModal] = useState(false);


  const dispatch = useDispatch();
  const columnsVisibility = useSelector((state) => state.columnsVisibility);
 
    // const toggleColumnVisibility = (column) => {
    //   dispatch(toggleColumnVisibility(column));
    // };
 
    // useEffect(() => {
    //   // Get columnsVisibility from local storage
    //   let persistedColumnsVisibility = JSON.parse(localStorage.getItem("columnsVisibility"));
    
    //   // Check if persistedColumnsVisibility is null or undefined
    //   if (!persistedColumnsVisibility) {
    //     // If not present, initialize it with default values
    //     persistedColumnsVisibility = {
    //       photo: true,
    //       name: true,
    //       age: true,
    //       email: true,
    //       register_date: true, // Add register_date column
    //     };
    
    //     // Save the initialized columnsVisibility to local storage
    //     localStorage.setItem("columnsVisibility", JSON.stringify(persistedColumnsVisibility));
    //   } else {
    //     // If "register_date" column is missing, add it
    //     if (!persistedColumnsVisibility.hasOwnProperty("register_date")) {
    //       persistedColumnsVisibility["register_date"] = true;
    
    //       // Update local storage with the added "register_date" column
    //       localStorage.setItem("columnsVisibility", JSON.stringify(persistedColumnsVisibility));
    //     }
    //   }
    
    //   // Dispatch action to update Redux state with the modified columnsVisibility
    //   dispatch({ type: "RENAME_COLUMN", payload: { oldColumnName: "register date", newColumnName: "register_date" } });
    //   // eslint-disable-next-line
    // }, []);
    
    useEffect(() => {
      // Get columnsVisibility from local storage
      let persistedColumnsVisibility = JSON.parse(localStorage.getItem("columnsVisibility"));
    
      // Remove "gender" column if present
      if (persistedColumnsVisibility && persistedColumnsVisibility.hasOwnProperty("gender")) {
        delete persistedColumnsVisibility["gender"];
        localStorage.setItem("columnsVisibility", JSON.stringify(persistedColumnsVisibility));
      }
    
      // Check if persistedColumnsVisibility is null or undefined
      if (!persistedColumnsVisibility) {
        // If not present, initialize it with default values
        persistedColumnsVisibility = {
          photo: true,
          name: true,
          age: true,
          email: true,
          register_date: true, // Add register_date column
        };
    
        // Save the initialized columnsVisibility to local storage
        localStorage.setItem("columnsVisibility", JSON.stringify(persistedColumnsVisibility));
      } else {
        // If "register_date" column is missing, add it
        if (!persistedColumnsVisibility.hasOwnProperty("register_date")) {
          persistedColumnsVisibility["register_date"] = true;
    
          // Update local storage with the added "register_date" column
          localStorage.setItem("columnsVisibility", JSON.stringify(persistedColumnsVisibility));
        }
      }
    
      // Dispatch action to update Redux state with the modified columnsVisibility
      dispatch({ type: "RENAME_COLUMN", payload: { oldColumnName: "register date", newColumnName: "register_date" } });
      // eslint-disable-next-line
    }, []);
    
   useEffect(()=>{
      axios.get('https://randomuser.me/api/?results=20').then(
        (response)=>{
          setUserList(response.data.results);
          console.log(response.data.results);
        }
      )
   },[]);

  //  const toggleColumnVisibility = (column) => {
  //   setColumnsVisibility(prevState => ({
  //     ...prevState,
  //     [column]: !prevState[column]
  //   }));
  // };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

//   const exportToExcel = () => {
//     const dataToExport = userList.map(user => ({
//        Photo: user.picture.large,
//        Name: user.name.first,
//        Age: user.dob.age,
//        Gender: user.gender,
//        Email: user.email
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "User Data");

//     // Export the workbook as an .xlsx file
//     XLSX.writeFile(workbook, "user_data.xlsx");
//  };

const exportToExcel = () => {

  const filteredAndSortedData = userList
    .filter((elem) => {
      if (typeof search === 'string' && search.trim() !== "") {
        return elem.name.first.toLowerCase().includes(search.trim().toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      return isAscending ? a.dob.age - b.dob.age : b.dob.age - a.dob.age;
    });

 
  const dataToExport = filteredAndSortedData.map((user) => {
    const rowData = {};
    Object.keys(columnsVisibility).forEach((column) => {
      if (columnsVisibility[column]) {
        switch (column) {
          case "photo":
            rowData["Photo"] = user.picture.large;
            break;
          case "name":
            rowData["Name"] = user.name.first;
            break;
          case "age":
            rowData["Age"] = user.dob.age;
            break;
          
          case "email":
            rowData["Email"] = user.email;
            break;
          case "register_date":
            rowData["Registered Date"] = user.registered.date;
            break;
          default:
            break;
        }
      }
    });
    return rowData;
  });

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "User Data");
  XLSX.writeFile(workbook, "user_data.xlsx");
};




   const selectPageH =(selectPage) =>{
    if(selectPage >= 1 && 
        selectPage <= userList.length / 4 &&
        selectPage !== page ) 
    setPage(selectPage);
}
    return(
      <>
      <div className="container">
      <div className="main">
          {showModal && (
            <ColumnVisibilityModal
              columnsVisibilityprop={columnsVisibility}
              toggleColumnVisibility={(column) => {
                dispatch(toggleColumnVisibility(column));
              }}
              closeModal={toggleModal}
            />
          )}
          <div className="nav">
          <div className="nav-input" >
          <input className="main-input" type="text" placeholder="Search by name or email " onChange={(e) => setSearch(e.target.value)}/> 
          </div>
      
      <div className="nav-button">
      <button onClick={()=>setIsAscending(!isAscending)}> {isAscending ? "Descending order" : " Ascending order"} </button>
      <button onClick={toggleModal}>Column Visibility</button>
      <button onClick={exportToExcel}>Export to Excel</button>
      </div>
      
      </div>

          <table className="main-table" >
          <thead className="table-head">
          <tr className="">
               
                {columnsVisibility.photo && <th className="p-4">Customer</th>}
                {columnsVisibility.name && <th className="p-4">Name</th>}
                {columnsVisibility.age && <th className="p-4">Age
                <span onClick={()=>setIsAscending(!isAscending)} > {isAscending ? "⬇️":"⬆️" }</span>
                </th>}
               
                {columnsVisibility.email && <th className="p-4">Email</th>}
                {columnsVisibility.register_date && <th className="p-4">Registered Date</th>}
              </tr>
          </thead>
          <tbody>
          
           
          {
            // eslint-disable-next-line
            userList.slice(page * 4 - 4, page * 4).filter((elem) => {
            // eslint-disable-next-line
            if(search === " "){
              return elem
              // eslint-disable-next-line
            }else if( elem.name.first.includes(search)|| elem.email.includes(search)){
              return elem.name.first
            }
          }).sort((a,b)=> {
             if(isAscending){
              return  a.dob.age - b.dob.age
             }else{ 
              return b.dob.age - a.dob.age
             }

          }).map((elem, idx)=>{
            return(
              <tr className={idx % 2 === 0 ? "list-group-item" : "list-group-item-odd"} key={idx}>
                   
                    {columnsVisibility.photo && <td className="p-3">
                      <div className="customer"><div><img src={elem.picture.large} alt="p" /></div>&nbsp; &nbsp;<div><h4> {elem.name.first}</h4><p>{elem.login.username}</p></div></div> 
                    </td>}
                   
                    {columnsVisibility.name && <td className="p-3">
                      <p>{elem.name.first}</p>
                    </td>}
                    {columnsVisibility.age && <td className="p-3">
                      <p>{elem.dob.age}</p>
                    </td>}
                 
                    {columnsVisibility.email && <td className="p-3">
                    <p>{elem.email}</p>
                    </td>}
                    {columnsVisibility.register_date && <td className="p-3">
                    <p>{new Date(elem.registered.date).toLocaleString()}</p>
                    </td>}

                  </tr>
            )
           })}
           
          </tbody>
        </table>
       
        {userList.length > 0 && <div className="pagination">
        <span  onClick={()=> selectPageH(page - 1)} > ⬅️</span>
        {[...Array(userList.length/4)].map((_,i)=>
        {return <span className={page === i+1 ? "s":""} onClick={()=> selectPageH(i+1)}>{i+1}&nbsp;</span>})}
        <span  onClick={()=> selectPageH(page + 1)}> ➡️</span>
      
        </div>}

        </div>
      
      </div>
      
      </>
    )
}

export default Users