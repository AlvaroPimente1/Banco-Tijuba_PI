import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, Image } from "react-native";
import { formatDate } from "../../utils/formatDate";
import ParamContext from "../../context/projetoContext";
import firestore from '@react-native-firebase/firestore';

export default function DoacaoUserScreen(){
    const { params } = useContext(ParamContext);
    const projetos = params.projeto;
    const [ doacoes, setDoacoes ] = useState([]);

    useEffect(()=>{
            const doacaoRef = firestore().collection('projetos').doc(projetos.id).collection('doacoes_projeto').orderBy('dt_solicitacao', 'desc');
            const unsub = doacaoRef.onSnapshot((snapshot) =>{
                const doacoesArray = snapshot.docs.map(doc => {
                    return{ ...doc.data(), id: doc.id };
                })
                setDoacoes(doacoesArray);
            }, error => {
                Alert.alert('Erro', 'Ocorreu um erro ao consultar as solicitações de doação')
            })
            
            return ()=>{
                unsub();
            }
        }, [])

    function renderItem({ item }){
        const isCheck = item.check;

        return(
            <View style={styles.containerLista}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                        <Text style={{ color: '#fff', fontSize: 15 }}>{item.nome_doacao}</Text>
                        <Text style={{ color: '#fff', fontSize: 13, marginTop: 3 }}>Data da solicitação: {formatDate(item.dt_solicitacao)}</Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    {
                            isCheck ?
                            <View
                                style={{ backgroundColor: 'red', paddingHorizontal: 5, paddingVertical: 5, borderRadius: 10 }}
                            >
                                <Text style={{ color: '#fff' }}>Indisponível pra doar!</Text>
                            </View>
                            :
                            <View
                            style={{ backgroundColor: 'green', paddingHorizontal: 5, paddingVertical: 5, borderRadius: 10 }}
                            >
                                <Text style={{ color: '#fff' }}>Disponível para doar</Text>
                            </View>
                        }
                    </View>
                </View>
            </View>
        )
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.containerTitulo}>
                <Text style={styles.titulo}>Mural do que precisamos</Text>
            </View>
            <FlatList   
                data={doacoes}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C1C',
    },

    containerLista: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginVertical: 5,
        borderColor: '#663399',
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderWidth: 1,
    },

    containerTitulo: {
        marginVertical: 30,
        alignItems: 'center'
    },

    titulo: {
        fontSize: 25,
        color: '#fff'
    }
})