import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import { Button, Modal, Input, message, Alert, Spin, Space, Card, Upload, Checkbox, Popconfirm } from 'antd';
import {
  EditTwoTone
} from '@ant-design/icons';
import { EditOutlined, EllipsisOutlined, SettingOutlined, UserOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Grid,
  Header,
  Icon
} from 'semantic-ui-react'

import { createOrder, deleteOrder, getOrders, getUploadUrl, patchOrder, uploadFile } from '../api/orders-api'
import Auth from '../auth/Auth'
import { Order } from '../types/Order'
import TextArea from 'antd/lib/input/TextArea';
const { Search } = Input;
interface TodosProps {
  auth: Auth
  history: History
}
enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}
interface OrdersState {
  orders: Order[]
  newOrderName: string
  loadingTodos: boolean,
  isModalOpen: boolean,
  openUpload: boolean,
  openEdit: boolean,
  description: string,
  status: '' | 'error',
  currTodo: any,
  file: any,
  uploadState: UploadState,
  title:string
}

export class Todos extends React.PureComponent<TodosProps, OrdersState> {
  state: OrdersState = {
    orders: [],
    newOrderName: '',
    loadingTodos: true,
    isModalOpen: false,
    status: '',
    description: '',
    openUpload: false,
    openEdit: false,
    currTodo: null,
    file: null,
    uploadState: UploadState.NoUpload,
    title:''
  }
  constructor(props: TodosProps){
    super(props);
    this.setUploadState = this.setUploadState.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.showFormNewTaks = this.showFormNewTaks.bind(this);
    this.onTodoDelete = this.onTodoDelete.bind(this);
    this.onEditButtonClick = this.onEditButtonClick.bind(this);
    this.onUploadButtonClick = this.onUploadButtonClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.onUploadButtonClick = this.onUploadButtonClick.bind(this);
  }
  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ status: '', newOrderName: event.target.value })
  }

  onUploadButtonClick = (order: Order) => {
    this.setState({ currTodo: order, openUpload: true });
  }
  onEditButtonClick = (order: Order) => {
    this.setState({title:'Edit Order', currTodo: order, openEdit: true, description: order.description, newOrderName: order.name });
  }

  onTodoDelete = async (orderId: string) => {
    try {
      await deleteOrder(this.props.auth.getIdToken(), orderId)
      this.setState({
        orders: this.state.orders.filter(todo => todo.orderId !== orderId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }
  

  async componentDidMount() {
    try {
      const orders = await getOrders(this.props.auth.getIdToken())
      this.setState({
        orders,
        loadingTodos: false
      })
    } catch (e: any) {
      message.error(`Failed to fetch orders: ${e.message}`);
    }
  }
  
  showFormNewTaks = async () => {

    this.setState({
      isModalOpen: true,
      title:'New Order'
    })
  };
  handleOk = async () => {
    this.setState({
      loadingTodos: true
    })
    if (this.state.newOrderName == null || this.state.newOrderName.trim() === '') {
      this.setState({ status: 'error' })
      message.error('Please enter task name');
      return;
    }
    if (this.state.openEdit) {
      await patchOrder(this.props.auth.getIdToken(), this.state.currTodo.orderId, {name:this.state.newOrderName, description:this.state.description,attachmentUrl:this.state.currTodo.attachmentUrl})
      const orders = await getOrders(this.props.auth.getIdToken())
      this.setState({
        orders: [...orders],
        newOrderName: '',
        isModalOpen: false,
        loadingTodos: false,
        openEdit: false
      })
    } else {
      const dueDate = this.calculateDueDate()
      const newTodo = await createOrder(this.props.auth.getIdToken(), {
        name: this.state.newOrderName,
        dueDate
      });
      this.setState({
        orders: [...this.state.orders, newTodo],
        newOrderName: '',
        isModalOpen: false,
        loadingTodos: false,
        openEdit: false
      })
    }



  }

  handleCancel = () => {
    this.setState({
      newOrderName: '',
      description:'',
      isModalOpen: false,
      openEdit: false
    })
  }
  onSearch = async (value: string) => {
    try {
      const orders = await getOrders(this.props.auth.getIdToken(), value)
      this.setState({
        orders,
        loadingTodos: false
      })
    } catch (e: any) {
      message.error(`Failed to fetch todos: ${e.message}`);
    }
  }
  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }
  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    this.setState({
      loadingTodos: true
    })
    try {
      if (!this.state.file) {
        message.error('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.state.currTodo?.orderId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file);
      const orders = await getOrders(this.props.auth.getIdToken())
      this.setState({
        orders
      })
      message.success('File was uploaded!');
    } catch (e: any) {
      message.error(`Could not upload a file:  ${e.message}`)
    } finally {
      this.setUploadState(UploadState.NoUpload);
      this.setState({ openUpload: false, loadingTodos: false })

    }
  }
  handleCancelUpload() {
    this.setState({ openUpload: false, currTodo: null })
  }
  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          onClick={this.handleSubmit}
          loading={this.state.uploadState !== UploadState.NoUpload}
        >
          Upload
        </Button>
      </div>
    )
  }
  render() {
    return (
      <div>
        <Spin spinning={this.state.loadingTodos} tip="Loading..." size='large'>
          <Header as="h1">ORDERS</Header>

          {this.renderCreateTodoInput()}

          {this.renderTodos()}
        </Spin>
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Space direction="vertical" size="small" style={{ display: 'flex' }}>

        <Search
          placeholder="input search text"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={this.onSearch}
        />
        <Button type="primary" onClick={this.showFormNewTaks}>
          New Order
        </Button>
        <Modal title ={this.state.title} open={this.state.isModalOpen || this.state.openEdit} onOk={this.handleOk} onCancel={this.handleCancel}>
        <label >Order name</label>
          <Input
            placeholder="Enter your order name"
            prefix={<UserOutlined className="site-form-item-icon" />}
            allowClear={true}
            value={this.state.newOrderName}
            onChange={this.handleNameChange}
            status={this.state.status}
          />
          <label >Description</label>
          <TextArea
            placeholder="Enter description"
            allowClear={true}
            value={this.state.description}
            onChange={e => { this.setState({ description: e.target.value }) }}
          ></TextArea>
        </Modal>
        <Modal title="Upload file" open={this.state.openUpload} onOk={this.handleSubmit} onCancel={this.handleCancelUpload}>
          <Space direction="vertical" size="small" style={{ display: 'flex' }}>
            <h1>Upload new image</h1>

            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Space>
        </Modal>
      </Space>

    )
  }

  renderTodos() {
    return this.renderTodosList()
  }


  renderTodosList() {
    return (
      <Grid padded>

        {this.state.orders?.map((todo, pos) => {
          return (
            <Grid.Row key={todo.orderId}>
              <Card title={todo.name} style={{ width: 500 }}
                cover={todo.attachmentUrl && <img alt="image" src={todo.attachmentUrl} />}

              >
                <Space size="small" style={{ display: 'flex' }}>
                  <TextArea value={todo.description} readOnly={true}></TextArea>


                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onUploadButtonClick(todo)}
                  >
                    <UploadOutlined />
                  </Button>
                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onEditButtonClick(todo)}
                  >

                    <EditTwoTone />
                  </Button>
                  <Popconfirm title="Are you sure delete this task?" okText="Yes" cancelText="No" onConfirm={()=>this.onTodoDelete(todo.orderId)}>
                    <Button
                      icon
                      color="red"
                    >
                      <Icon name="delete" />
                    </Button>
                  </Popconfirm>

                </Space>

              </Card>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
