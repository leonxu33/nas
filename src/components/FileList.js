import React from 'react';
import Table from 'react-bootstrap/Table'
import FileElement from "./FileElement";

export default function FileList(props) {
    if (props.fileList !== null) {
        //console.log(props)
        return (
            <div className="tableFixHead">
                <Table striped hover size="sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Last Modified</th>
                            <th>Size</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.fileList.map((item) => (
                            <FileElement key={item.name} metadata={item} curDir={props.curDir} handleRefresh={props.onRefreshFileList} />
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    }
    return <div></div>;
}