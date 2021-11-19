import React, { useState } from "react";
import "./Table.css";
import MaterialTable from "material-table";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";

export default function Table({ Projects }) {
  // const [select, setSelect] = useState(false);
  // var icons;
  // select == false ? (icons = Clear) : (icons = Check);
 // const mapedData =() =>{
  //  Projects.map((i, idx) => {
  //   return [{ SNo: idx, description: i.description, vote: i.total_votes, likes: i.likes, dislikes: i.dislikes, unsure: i.unsure }]
  //  })
  //}

  return (
    <div className="table_style">
      <MaterialTable
        columns={[
          { title: "ID.", field: "id" },
          { title: "Description", field: "description" },
          { title: "Total # of votes", field: "total_votes" },
          { title: "Likes", field: "likes" },
          { title: "Dislikes", field: "dislikes" },
          { title: "Indifferent", field: "abstention" }
          
          
          // {
          //   cellStyle: {
          //     height: 50.5
          //   },
          // },
        ]}
        data={
          query =>
            new Promise((resolve, reject) => {
                // prepare your data and then call resolve like this:
                resolve({
                    data: Projects,
                    //totalCount: Projects.length,
                });
            })
        

          // [
          // // mapedData()
          // { SNo: "1", name: "Baran", vote: "10" },
          // { SNo: "2", name: "Baran", vote: "10" },
          // { SNo: "3", name: "Baran", vote: "10" },
          // ]
        }
        title="Project"
        options={{
          search: false,
          paging: false,
          sorting: false,
          // selection: true,
          rowStyle: { height: 39.5 },
        }}
        localization={{
          header: {
            actions: "Choose",
          },
        }}
        // onRowClick={(() =>  setSelect(!select))}
        // actions={[
        //   {
        //     icon: icons,
        //     //icons: {tableIcons},
        //     onClick: (event, rowData) => {
        //       // setSelect(!select);
        //     },
        //   },
        // ]}
      />
    </div>
  );
}
