import React, {useState} from 'react';
import { Breadcrumb, Button } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import CreateFolderModel from './CreateFolderModel';
import FileUploadModel from './FileUploadModel';

export default function FileToolBar(props) {
    const [search, setSearch] = useSearchParams()
    const [showCreateFolder, setShowCreateFolder] = useState(false)
    const [showUpload, setShowUpload] = useState(false)

    let navList = []
    let temp = ""
    navList.push(
        {
            index: 0,
            name: "root",
            dir: ""
        }
    )
    for (let i = 0; i < props.curDir.length; i++) {
        temp = temp + "/" + props.curDir[i]
        let item = {
            index: i + 1,
            name: props.curDir[i],
            dir: temp
        }
        navList.push(item)
    }

    const onUpperDir = () => {
        let currentDirectoryArr = props.curDir
        currentDirectoryArr.pop()
        const newDir = currentDirectoryArr.join("/")
        setSearch({ prefix: newDir })
    }

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item></Breadcrumb.Item>
                {navList.map(item => (
                    <Breadcrumb.Item key={item.index} onClick={() => setSearch({ prefix: item.dir })} >
                        {item.name}
                    </Breadcrumb.Item>
                ))}
            </Breadcrumb>

            <div className="spacer">
                <Button variant="secondary" onClick={onUpperDir}>Back</Button>
                <Button variant="info" onClick={props.handleRefresh}>Refresh</Button>
                <Button variant="light" onClick={() => setShowCreateFolder(true)}>Create Folder</Button>
                <Button variant="warning" onClick={() => setShowUpload(true)}>Upload</Button>

                <CreateFolderModel curDir={props.curDir} show={showCreateFolder} setShow={setShowCreateFolder} handleRefresh={props.handleRefresh} />
                <FileUploadModel curDir={props.curDir} show={showUpload} setShow={setShowUpload} upload={props.upload} handleRefresh={props.handleRefresh} />
            </div>
        </div>

    );
}
