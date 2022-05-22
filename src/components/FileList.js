import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table'
import { useDispatch, useSelector } from 'react-redux';
import FileElement from "./FileElement";
import { addToSelectedFiles, removeAllSelectedFiles, sortFileList } from '../redux/fileList/fileListSlice';
import { Form } from 'react-bootstrap';

export default function FileList(props) {
    const fileList = useSelector(state => state.fileList.fileList)
    const selectedFiles = useSelector(state => state.fileList.selectedFiles);
    const [sortUp, setSortUp] = useState(true)
    const [checked, SetChecked] = useState(false);
    const dispatch = useDispatch()

    useEffect(() => {
        if (selectedFiles.length !== fileList.length) {
            SetChecked(false)
        }
    }, [selectedFiles])

    const onCheckedAll = () => {
        if (!checked) {
            fileList.forEach(file => {
                dispatch(addToSelectedFiles(file.name))
            });
        } else {
            dispatch(removeAllSelectedFiles())
        }
        SetChecked(!checked)
    }

    const onSort = (key) => {
        setSortUp(!sortUp)
        dispatch(sortFileList({ sortKey: key, isAscend: sortUp }))
    }
    if (fileList !== null) {
        return (
            <div >
                <Table striped className='table mainfilelist-table'>
                    <thead >
                        <tr >
                            <th scope='col' className='col-1'><Form.Check checked={checked} type={'checkbox'} onChange={onCheckedAll}/></th>
                            <th scope='col' className='col-5 table-filelist-header' onClick={() => onSort("name")}>Name</th>
                            <th scope='col' className='col-2 table-filelist-header' onClick={() => onSort("type")}>Type</th>
                            <th scope='col' className='col-2 table-filelist-header' onClick={() => onSort("date")}>Last Modified</th>
                            <th scope='col' className='col-2 table-filelist-header' onClick={() => onSort("size")}>Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fileList.map((item, index) => (
                            <FileElement key={index} metadata={item} handleRefresh={props.onRefreshFileList} />
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    }
    return <div></div>;
}