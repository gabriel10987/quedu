import React, {useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Text, Pressable  } from 'react-native';
import AppBar from '../../components/AppBar';
import Button from '../../components/common/Button';
import CustomTextInput from '../../components/common/TextInput';
import CustomDropdown from '../../components/common/CustomDropdown';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../src/colors';
import QueduServices from '../../src/api/QueduServices';
import UserService from '../../src/api/UserServices';
import CreateCourseService from '../../src/api/CreateCourseService';

const optionsNumberQuestion = [
    { label: '1 pregunta', value: '1' },
    { label: '2 preguntas', value: '2' },
];
const CreateQueduScreen = ({navigation, route}) => {

    const [queduName, setQueduName] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedQuestions, setSelectedQuestions] = useState(null);
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [optionsCourse, setOptionsCourse] = useState([]);

    const selectedDoc = route?.params?.selectedDoc;
    
    const fetchUserCourses = async () => {
        try {
          const userIdGetted = await UserService.getUserId();
          const gettingUserCourses = await CreateCourseService.getCoursesByUserId(userIdGetted);
    
          const coursesOptions = gettingUserCourses.map(course => ({
            label: course.name,
            value: course.name
          }));
          
          setOptionsCourse(coursesOptions);
        } catch (error) {
          console.error("Error al obtener cursos del usuario:", error);
        }
    };

    // Cargar cursos cada vez que se regrese a esta pantalla
    useFocusEffect(
      useCallback(() => {
        fetchUserCourses();
      }, [])
    );

    useEffect(() => {
        console.log("Documento recibido en CreateQueduScreen: ", selectedDoc);
    }, [selectedDoc]);

    useEffect(() => {
        if (queduName && selectedCourse && selectedQuestions) {
            setIsButtonEnabled(true);
        } else {
            setIsButtonEnabled(false);
        }
    }, [queduName, selectedCourse, selectedQuestions]);

    const handleValueChangeCourse = (value) => {
        setSelectedCourse(value);
    };

    const handleValueChangeQuestions = (value) => {
        setSelectedQuestions(value);
    };
    const handleCreateCourse = () => {
        navigation.navigate("CreateCourseScreen", { onCourseCreated: fetchUserCourses });
      };
    
    
    const handleFinalizarPress = async () => {
        if (isButtonEnabled && selectedDoc) {
            const userIdGetted = await UserService.getUserId();

            const formData = new FormData();
            formData.append('userId', userIdGetted);
            formData.append('queduName', queduName);
            formData.append('courseName', selectedCourse);
            formData.append('questions', selectedQuestions);
            formData.append('document', {
                uri: selectedDoc.assets[0].uri,
                type: selectedDoc.assets[0].mimeType,
                name: selectedDoc.assets[0].name
            })
            // debug:
            console.log("ID del usuario: ", userIdGetted);
            console.log("Nombre del quedu: ", userIdGetted);
            console.log("Curso seleccionado: ", selectedCourse);
            console.log("cantidad de preguntas seleccionada: ", selectedQuestions);
            console.log('Creando Quedu...')

            const queduGenerated = await QueduServices.generateQuedu(formData);

            const insertQuedu = await QueduServices.createQueduInUser(queduGenerated);

            console.log("quedu generado correctamente: ", queduGenerated);
            navigation.navigate("QuestionResolutionScreen");
        }
    }

    return (
        <View style={styles.container}>
            <AppBar navigation={navigation} />
            <View style={styles.content}>
                <Text style={styles.title}>
                    {selectedDoc?.assets?.[0]?.name || "Archivo no seleccionado"}
                </Text>

                <View style={styles.dropdownWithIcon}>
                    <CustomDropdown
                        options={optionsCourse}
                        selectedValue={selectedCourse}
                        onValueChange={handleValueChangeCourse}
                        placeholder="Curso"
                        borderColor={colors.lightBlue}
                        style={{ width: '100%' }}
                    />
                    <Pressable style={styles.addButton} onPress={handleCreateCourse}>
                        <Ionicons name="add" size={25} color={colors.darkBlue} />
                    </Pressable>
                </View>

                <CustomDropdown
                    options={optionsNumberQuestion}
                    selectedValue={selectedQuestions}
                    onValueChange={handleValueChangeQuestions}
                    placeholder="# de preguntas"
                    borderColor={colors.lightBlue}
                    style={{ width: '60%' }}                />

                <CustomTextInput
                    value={queduName}
                    onChangeText={setQueduName}
                    placeholder="Nombre del quedu"
                    borderColor={colors.lightBlue}
                    style={{ width: '60%' }}
                />

                <Button 
                    title="Finalizar" 
                    backgroundColor={isButtonEnabled ? colors.darkBlue : colors.gray} 
                    textColor={colors.white} 
                    onPress={handleFinalizarPress}
                    disabled={!isButtonEnabled}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    content: {
      height: '35%',
      gap: 20,
      alignItems: 'center',      
      paddingTop: 20,
    },
    title: {
        fontSize: 16,
        fontFamily: 'Quicksand-Regular',
        color: colors.darkBlue,
        marginHorizontal: 24,
    },
    dropdownWithIcon: {
        width: '60%',
        position: 'relative',
    },
    addButton: {
        position: 'absolute',
        right: -35,
        top: '50%',
        transform: [{ translateY: -12.5 }],
    },
  }); 
  
  export default CreateQueduScreen;