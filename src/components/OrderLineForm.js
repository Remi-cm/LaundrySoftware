import React, { Component } from 'react'
import axios from 'axios';
import {
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    DatePicker,
    Icon,
    Row,
    Col
} from 'antd';

const { TextArea } = Input;

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTc5ODc3NTMxLCJqdGkiOiJiMDNlYTgxMTE5MzY0NzlhOTVlMTk2MDAyODhiZDM2MSIsInVzZXJfaWQiOjJ9.H9DfCghoInYmtslKio3IuT8zWvVwbsklvzbkLurz-UA";

class OrderLineForm extends Component {

    state = {
        Clothes: [],
        clotheSelected: this.props.id ? this.props.id : undefined,
        laundrySelected: this.props.laundryID,
        uniquePrice: this.props.price ? this.props.price : 0,
        price: this.props.price ? this.props.quantity*this.props.price : 0,
        quantity: this.props.quantity ? this.props.quantity : 1,
        orderLineCreated: [],
        haha: "Euille"
    }

    decrementQty = () => {
        if (this.state.quantity <= 1)
            return;
        else
            this.setState({ quantity: this.state.quantity - 1, price: (this.state.quantity - 1) * this.state.uniquePrice });
    }
    incrementQty = () => {
        this.setState({
            quantity: this.state.quantity + 1, price: (this.state.quantity + 1) * this.state.uniquePrice
        });
        console.log(this.state.quantity);
    }
    handleClotheChange = (value) => {
        console.log(`selected ${value}`);
        axios.get('http://127.0.0.1:8000/api/clothe/' + value,
            {
                headers: { "Authorization": "Bearer " + this.props.token }
            })
            .then(
                res => {
                    this.setState({
                        uniquePrice: res.data.price,
                        price: res.data.price * this.state.quantity,
                    });
                    console.log(res.data.price);
                }
            )
        this.setState({ clotheSelected: value });
    }

    handleFormSubmit = (event, requestType, orderLineID) => {
        event.preventDefault();
        //(requestType == 'post') ? event.preventDefault() : this.setState({ haha: "Maama"});
        const laundry = this.state.laundrySelected;
        const clothe = this.state.clotheSelected;
        const quantity = this.state.quantity;
        const price = this.state.uniquePrice;
        const description = event.target.elements.description.value;
        const color = event.target.elements.color.value;
        const laundry_key = this.state.laundrySelected;
        console.log("laundry :" + laundry + " clothe :" + clothe + " price: " + price + " descriprion: " + description + " colour: " + color + " Quantity: " + quantity);
       
        switch (requestType) {
            case 'post':
                return axios.post('http://127.0.0.1:8000/api/order-line/',
                    {
                        laundry: laundry,
                        clothe: clothe,
                        color: color,
                        price: price,
                        description: description,
                        quantity: quantity,
                        laundry_key: laundry_key

                    },
                    {
                        headers: { "Authorization": "Bearer " + this.props.token }
                    }
                )
                    .then(res => {
                        console.log(res.data);
                        this.setState({ orderLineCreated: res.data });
                        this.props.refresh();
                        this.props.relaunch();

                    })
                    .catch(err => console.log(err));
            case 'put':
                return axios.put(`http://127.0.0.1:8000/api/order-line/${this.props.orderLineID}/`,
                    {
                        laundry: laundry,
                        clothe: clothe,
                        color: color,
                        price: price,
                        description: description,
                        quantity: quantity
                    },
                    {
                        headers: { "Authorization": "Bearer " + this.props.token }
                    }
                )
                    .then(res => { console.log(res.data); this.props.closeModal(); this.props.relaunch(); })
                    .catch(err => console.log(err));
        }
    }

    componentDidMount() {
        const laundryID = this.props.laundryID;
        this.setState({ laundrySelected: laundryID });

        axios.get('http://127.0.0.1:8000/api/clothe/',
            {
                headers: { "Authorization": "Bearer " + this.props.token }
            })
            .then(
                res => {
                    this.setState({
                        Clothes: res.data,
                    });
                    console.log(res.data);
                }
            )
    }
    render() {
        let clothes = this.state.Clothes;

        let clotheItems = clothes.map((clothe) =>
            <option value={clothe.id}>{clothe.name}</option>
        );
        return (
            <div>
                <Form onSubmit={(event) => this.handleFormSubmit(event, this.props.requestType, this.props.orderLineID)}>
                    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
                        <Col className="gutter-row" span={8}>
                            <div className="gutter-box">
                                Clothe:
        <Select onChange={this.handleClotheChange}
                defaultValue={this.state.clotheSelected} 
                placeholder="Select Clothe" 
                name="clotheId"
                showSearch
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    } >
                                    {clotheItems}
                                </Select>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={4}>
                            <div className="gutter-box">
                            Price:
<br />
                                <InputNumber
                                    disabled={true}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    name="cost"
                                    value={this.state.price}
                                    placeholder="Laundry cost"
                                    prefix={<Icon type="dollar" />}
                                    suffix="FCFA" />
                                
                            </div>
                        </Col>
                        <Col className="gutter-row" span={4}>
                            <div className="gutter-box">
                                Quantity: <br />
                                <Button onClick={this.decrementQty} shape="circle"><span style={{ fontWeight: "bold" }}>-</span></Button>
                                {" " + this.state.quantity + " "}
                                <Button onClick={this.incrementQty} shape="circle"><span style={{ fontWeight: "bold" }}>+</span></Button>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <div className="gutter-box">
                            Colour:
                    <Input name="color" placeholder="colour" defaultValue={this.props.color}/>
                            </div>
                        </Col>
                    </Row>

                    Description:
                    <TextArea name="description" placeholder="Enter laundry description" defaultValue={this.props.description}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                    />
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {this.props.btnText}
                        </Button>
                    </Form.Item>

                </Form>



            </div>
        )
    }
}

export default OrderLineForm