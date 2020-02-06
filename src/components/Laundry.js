import React from 'react';
import { List, Avatar, Icon } from 'antd';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import JsonQuery from 'json-query';
//import AvatarMan from '../assets/images/avatar_man.jpg';
//import LaundryImg from '../assets/images/pressing2.png';

const IconText = ({ type, text }) => (
    <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
    </span>
);


const Laundry = (props) => {
    console.log('This is myyyyyyy '+JsonQuery('[*][id=2].client.name', {
        data: props.data
      }).value);
    return (

        <List
            itemLayout="vertical"
            size="large"
            pagination={{
                onChange: page => {
                    console.log(page);
                },
                pageSize: 5,
            }}
            dataSource={props.data}

            renderItem={item => (
                <List.Item
                    key={item.title}
                    actions={[
                        <IconText type="star-o" text={item.status} key="list-vertical-star-o" />,
                    <IconText type="dollar" text={item.price_estimated} key="list-vertical-like-o" />,
                        <IconText type="hourglass" text={<Moment fromNow>{item.time_expected}</Moment>} key="list-vertical-message" />,
                    ]}
                    extra={
                        <img
                        style={{borderRadius: '10px'}}
                            width={272}
                            height={100}
                            alt="logo"
                            src={item.imgUrl}
                        />
                    }
                >
                    <List.Item.Meta
                        avatar={<Avatar src={item.client.avatarUrl} />}
                        title={
                        <Link to={'detail/'+item.id}>
                            {JsonQuery('[*][id='+item.id+'].client.name', {data: props.data}).value}
                          </Link>
                        }
                        description={item.description}
                    />
                    {item.content}
                </List.Item>
            )}
        />
    )
}

export default Laundry;