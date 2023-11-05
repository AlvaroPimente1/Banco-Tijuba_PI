import React, { useContext, useState, useEffect } from "react";
import styles from "../../style/commonsStyles";
import ParamContext from "../../context/projetoContext";
import { View, SafeAreaView, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import ImageConteiner from "../../components/ImagemConteiner";
import { adicionarProjetoAoUsuario } from "../../firebase/api/user/addProjectUser";
import firestore from '@react-native-firebase/firestore';
import getUserID from "../../firebase/api/user/getUserID";

export default function DetailNew({ route }){
    const { params } = useContext(ParamContext);
    const projetos = params.projeto;

    const [ projetoDisponivel, setProjetoDisponivel ] = useState(true);

    useEffect(() => {
        async function verificarProjetoDisponivel() {
            const projetoRef = firestore().collection('projetos').doc(projetos.id);

            const projetoDoc = await projetoRef.get();

            if (projetoDoc.exists) {
                const solicitacoesProjeto = projetoDoc.data().solicitacoesProjeto;

                if (solicitacoesProjeto.includes(getUserID())) {
                    setProjetoDisponivel(false);
                }
            }
        }

        verificarProjetoDisponivel();
    }, [projetos.id]);
    
    return(
        <SafeAreaView style={styles.conteiner}>
            <ImageConteiner source={require('../../assets/images/imagemTeste.png')} />
            <ScrollView>
                    <Text style={styles.name}>{projetos.nome_projeto}</Text>
                <View style={styles.descriptionConteiner}>
                    <Text style={styles.description}>{projetos.descricao}</Text>
                </View>

                {
                    projetoDisponivel ?
                    <View style={styles.buttonConteiner}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => adicionarProjetoAoUsuario(projetos)}
                        >
                            <Text style={styles.buttonText}>Quero apoiar esse projeto!</Text>  
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{ alignItems: 'center', marginVertical: 30 }}>
                        <Text style={styles.buttonText}>Solicitação de participação em aguardo!</Text>
                    </View>
                }
            </ScrollView>
        </SafeAreaView>
    )
}
