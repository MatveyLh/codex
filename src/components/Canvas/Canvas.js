import React from "react";
import './Canvas.css';
import {buildCanvas} from '../../buildCanvas';

let result = '';

class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            error: '',
            canvas: '',
            result: '',
            url: '',
        }
        this.matrix = [];
    }

    showFile = async (e) => {
        e.preventDefault();
        this.matrix = [];
        const reader = new FileReader()
        reader.onload = async (e) => {
            this.setState({data: e.target.result.split('\n')}, this.createCanvas)
        };
        reader.readAsText(e.target.files[0]);
    }

    createCanvas = () => {
        const [res, canvas, error] = buildCanvas(this.matrix, this.state.data);

        if (!error) {
            this.setState({canvas: canvas});
            result = res;
            this.createUrl()
        }
        else this.setState({error: error});
    }


    createUrl = () => {
        const file = new File([result], 'output.txt');
        this.setState({url: URL.createObjectURL(file)});
    }

    render() {
        return (
            <React.Fragment>
                <div className={'input-wrapper'}>
                    <label htmlFor={'input-file'}>{!this.state.data.length ? 'Файл не загружен!' : ''}</label>
                    <input accept={'.txt'} type="file" className={'input-file'} onChange={(e) => this.showFile(e)}/>
                </div>
                {this.state.error ? <p className={'error-text'}>{this.state.error}</p> : <pre>{this.state.canvas}</pre>}
                {this.state.url ? <a href={this.state.url} style={{textDecoration: "none", color: '#000000'}}
                                     download={'output'}>Download canvas</a> :
                    <button disabled={true}>Download canvas</button> }
            </React.Fragment>
        )
    }
}

export default Canvas;