/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  FlatList,
  StatusBar,
  AsyncStorage,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  ToastAndroid,
  Button,
  TextInput,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
  Header
} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [todoItem, setTodoItem] = useState({title: '', description: ''});

  useEffect(()=>{
    getData();   
  }, []);

  const handleTodoAdd = () => {
    const key = todos.length + 1;
    if(todoItem.title === ''){
      showToastWithGravity('Title is required');
    }else if(todoItem.description === ''){
      showToastWithGravity('Description is required');
    }else{
      setTodoItem({title: '', description: ''});
      storeData({key, ...todoItem});
    }
  }

  const handleTodoDel = async (id) => {
    try {
      let storedTodos = await AsyncStorage.getItem('todo');
      storedTodos = JSON.parse(storedTodos);
      const newTodos = storedTodos.filter((todo)=>todo.key !== id);
      setTodos(newTodos);
      await AsyncStorage.setItem('todo', JSON.stringify(newTodos));
    } catch (error) {
      showToastWithGravity(error.message);
    }
  }

  const getData = async () => {
    try {
      let _todos = await AsyncStorage.getItem('todo');
      _todos = JSON.parse(_todos);
      if(_todos){
        setTodos([...todos, ..._todos]);
      }
    } catch (error) {
      showToastWithGravity(error.message);
    }
  }

  const storeData = async (data) => {
    try {
      let storedTodos = await AsyncStorage.getItem('todo');
      if(storedTodos){
        storedTodos = JSON.parse(storedTodos);
        storedTodos.push(data);
        setTodos([...storedTodos]);
        await AsyncStorage.setItem('todo', JSON.stringify(storedTodos));
      }else{
        await AsyncStorage.setItem('todo', JSON.stringify(data));
      }
      showToastWithGravity('Item added successfully');
    } catch (error) {
      showToastWithGravity(error.message);
    }
  };

  const showToastWithGravity = (message) => {
    ToastAndroid.showWithGravity(message,
      ToastAndroid.SHORT,ToastAndroid.BOTTOM
    );
  };

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Header />
      <View style={styles.containerView}>
        <TextInput 
          onChangeText={(val)=>setTodoItem({...todoItem, title: val})}
          style={styles.textInput}
          value={todoItem.title}
          placeholder="Enter Title" 
        />
        <TextInput 
          onChangeText={(val)=>setTodoItem({...todoItem, description: val})}
          multiline
          value={todoItem.description}
          style={[styles.textInput, styles.textDesc]}
          placeholder="Enter Desciption" 
        />
        <View style={styles.button}>
          <Button title="save" onPress={handleTodoAdd} />
        </View>
      </View>
      <Text style={styles.todoTitle}>Tasks ({todos.length})</Text>
      <FlatList
        style={styles.listContainer}
        keyExtractor={(item)=>item.key}
        data={todos}
        renderItem={({item})=>(
          <TouchableOpacity style={styles.touchable}>
            <View style={styles.todoItem}>
              <View>
                <Text>{item.title}</Text>
              </View>
              <Text style={styles.delText} onPress={()=>handleTodoDel(item.key)}>DEL</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  highlight: {
    fontWeight: '700',
  },
  touchable:{
    zIndex: 1
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    fontSize: 15
  },
  delText:{
    zIndex: 10
  },
  containerView: {
    marginHorizontal: 30,
  },
  button: {
    marginTop: 10,
    marginBottom: 15,
    fontWeight: '800'
  },
  todoItem: {
    color: 'gray',
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginVertical: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  listContainer:{
    width: '100%',
    paddingVertical: 8,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  todoTitle: {
    fontSize: 18,
    padding: 10,
    textTransform: 'uppercase',
    backgroundColor: 'rgba(238, 238, 238, 0.7)',
    textAlign: 'center',
    fontWeight: '900'
  }
});

export default App;
