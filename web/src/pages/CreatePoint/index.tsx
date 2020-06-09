import React,{useState,useEffect,ChangeEvent, FormEvent} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {FiArrowLeft} from 'react-icons/fi'
import axios from 'axios'
import {Map, TileLayer, Marker} from 'react-leaflet'
import {LeafletMouseEvent} from 'leaflet'
import api from '../../services/api'
import "./styles.css"
import logo  from '../../assets/logo.svg'
import Dropzone from '../../Components/DropZone'

//array ou objeto: manualmente informar o tipo de variavel
interface Item{
    id:number;
    title:string;
    image_url:string
}
interface IBGEUFResponse{
    sigla:string
}
interface IBGECityResponse{
    nome:string
}
const CreatePoint = () => {
    const [itens,setItens] = useState<Item[]>([])
    const [ufs,setUfs] = useState<string[]>([])
    const [cities,setCities] = useState<string[]>([])
    const [selectedUf,setSelectedUf] = useState("0")
    const [selectedCity,setSelectedCity] = useState("0")
    const [selectedPosition,setSelectedPosition] = useState<[number,number]>([0,0])
    const [initialPosition,setInitialPosition] = useState<[number,number]>([0,0])
    const [notification,setNotification] = useState(false)
    const [formData,setFormData] = useState({
        name:'',
        email:'',
        whatsaap:''
    })
    const [selectedItens,setSelectedItens] =  useState<number[]>([])
    const [selectedFile,setSelectedFile] = useState<File>()
    const history = useHistory()
    useEffect(() =>{
        api.get('itens').then(response =>{
            setItens(response.data)
        })
    },[])
    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla)
            setUfs(ufInitials)
        })
    },[])
    useEffect(() => {
        if(selectedUf === '0'){
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/distritos`)
        .then(response => {
            const cityNames = response.data.map(city => city.nome)
            setCities(cityNames)
        })
    },[selectedUf])
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude,longitude} = position.coords
            setInitialPosition([latitude,longitude])
        })
    },[])
    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value
        setSelectedUf(uf)
    }
    function handleSelectCity(event:ChangeEvent<HTMLSelectElement>){
        const city = event.target.value
        setSelectedCity(city)
    }
    function handleMapClick(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }
    function handleInputChange(event:ChangeEvent<HTMLInputElement>){
        const {name,value} = event.target

        setFormData({...formData,[name]:value})
    }
    function handleSelectItem(id:number){
        const alreadySelected = selectedItens.findIndex(item => item === id)

        if(alreadySelected >= 0){
            const filteredItens = selectedItens.filter(item => item !== id)
            setSelectedItens([...filteredItens])
        }else{
            setSelectedItens([...selectedItens,id])

        }
    }
    async function handleSubmit(event:FormEvent){
        event.preventDefault()

        const {name,email,whatsaap} = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude,longitude] = selectedPosition
        const itens = selectedItens

        const data = new FormData()

        
        data.append('name',name)
        data.append('email',email)
        data.append('whatsaap',whatsaap)
        data.append('uf',uf)
        data.append('city',city)
        data.append('latitude',String(latitude))
        data.append('longitude',String(longitude))
        data.append('itens',itens.join(','))
        if(selectedFile){
            data.append('image',selectedFile)
        }
        
        await api.post('points', data)

        setNotification(true)
        if(notification === false){
            history.push('/')

        }
    }
    return (
        <>
            {
                (notification)?
                <div onClick={() =>setNotification(false)}className={`${(notification)?"on": "off"}`}><span className="notification">Concluido</span></div>
                    :""
                
            }
        <div id="page-create-point">
            
            <header>
                <img src={logo} alt=""/>

                <Link to="/">
                    <FiArrowLeft/>
                    Voltar para home
                </Link> 

            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do<br/> ponto de coleta</h1>
                <Dropzone onFileUploaded={setSelectedFile}/>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da Entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                        <label htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleInputChange}
                        />
                        </div><div className="field">
                            <label htmlFor="whatsaap">whatsaap</label>
                            <input
                                type="text"
                                name="whatsaap"
                                id="whatsaap"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa </span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition}/>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado(UF)</label>
                            <select onChange={handleSelectUf} value={selectedUf} name="uf" id="uf">
                                <option value="0">Selecione um UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade(City)</label>
                            <select onChange={handleSelectCity} name="city" id="city">
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>                
                    </fieldset>
                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {itens.map(item => (
                            <li 
                                key={item.id} 
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItens.includes(item.id)? "selected" : ""}
                            >
                                <img src={item.image_url} alt=""/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                        

                    </ul>
                </fieldset>
                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
        </>
    )
}

export default CreatePoint