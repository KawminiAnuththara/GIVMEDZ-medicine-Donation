import { View, Text, TouchableOpacity,Image, TextInput,ScrollView ,FlatList,StyleSheet,SafeAreaView} from 'react-native'
import React,{useState,useRef,useEffect} from 'react'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'
import { firebase } from '../src/Config';
import { useNavigation } from '@react-navigation/native';

const MessageScreen = () => {
  const [message,setMessage]=useState([
    {
      user:1,
      time:'12.00',
      content:'Welcome to GIVMEDZ!'
    },
    {
      user:1,
      time:'12.05',
      content:"Thank you for joining the GIVMEDZ community,Explore the app, start donating, and feel the joy of giving today!"
    },
    {
      user:1,
      time:'12.07',
      content:'If you have any questions or need assistance, please do not hesitate to reach out to us here.'
    },
    {
      user:0,
      time:'12.09',
      content:'I am writing to request assistance in obtaining some medication that I urgently need.'
    },
    
  ]);
  currentUser=0;
  const user=useRef(0);
  const scrollView=useRef();

  const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = firebase.firestore().collection('messages').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(messagesData);
        });

        return () => unsubscribe();
    }, []);

    const handleSendMessage = () => {
        const user = firebase.auth().currentUser;
        if (user && newMessage.trim()) {
            firebase.firestore().collection('messages').add({
                senderId: user.uid,
                message: newMessage,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            }).then(() => {
                setNewMessage('');
            }).catch(error => console.log('Error sending message: ', error));
        }
    };

    const handleClearChat = () => {
        Alert.alert(
            "Clear Chat",
            "Are you sure you want to clear the chat?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Clear",
                    onPress: () => {
                        firebase.firestore().collection('messages').get().then(snapshot => {
                            const batch = firebase.firestore().batch();
                            snapshot.docs.forEach(doc => batch.delete(doc.ref));
                            return batch.commit();
                        }).then(() => {
                            console.log('Chat cleared successfully');
                        }).catch(error => console.log('Error clearing chat: ', error));
                    },
                    style: "destructive"
                }
            ]
        );
    };

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Messages',
            headerRight: () => (
                <TouchableOpacity onPress={handleClearChat}>
                    <Text style={styles.clearChatButton}>Clear Chat</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const [name,setName]=useState('')

    useEffect(()=>{
        firebase.firestore().collection('users')
        .doc(firebase.auth().currentUser.uid).get()
        .then((snapshot)=>{
            if(snapshot.exists){
                setName(snapshot.data())
            }
            else{
                console.log('user does not exist')
            }
        })
    },[])

  return (
    <SafeAreaView style={styles.container}>

    <View style={{
        flexDirection:'row',
        backgroundColor:'teal',
        paddingTop:50
       }}>
        <TouchableOpacity  onPress={()=>navigation.navigate('Home')} style={{marginTop:-25,marginLeft:10}}>
        <Ionicons name="chevron-back-outline" size={24} color="white" />
        </TouchableOpacity>

        <View style={{
          flexDirection:"row",
          justifyContent:'space-between',
          flex:1,
          paddingHorizontal:10
          }}>
          <TouchableOpacity style={{
            flexDirection:'row',
            flex:4,
            marginTop:-40,
            padding:10
            
            }}>
            <Image source={require('../assets/user.png')} style={{
              width:40,
              height:40,
              marginLeft:-10
            }}/>
            <View style={{
              
            }}>
              <Text style={{marginLeft:10,fontFamily:'serif',fontWeight:'bold',color:'white'}}>{name.fullname}</Text>
              <Text style={{marginLeft:10,fontFamily:'serif',color:'#999'}}>Online</Text>
            </View>
          </TouchableOpacity>

          <View style={{flexDirection:'row',marginTop:-27}} >
            <TouchableOpacity >
            <FontAwesome6 name="phone" size={24} color="white" style={{marginLeft:20}} />
            
            </TouchableOpacity>
            <TouchableOpacity>
            <FontAwesome6 name="ellipsis-vertical" size={24} color="white" style={{marginLeft:35,marginRight:14}} />
            </TouchableOpacity>
          </View>
        </View>
       </View>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <Text style={styles.sender}>{item.senderId}</Text>
                        <Text style={styles.message}>{item.message}</Text>
                        <Text style={styles.timestamp}>{item.timestamp.toDate().toLocaleString()}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                inverted
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type your message here..."
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>  
    
       
   
  )
}

export default MessageScreen

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
  },
  messageContainer: {
      padding: 10,
      borderColor: '#ddd',
      borderWidth:1,
      borderRadius:10,
      width:'90%',
      marginLeft:20,
      marginBottom:10
  },
  sender: {
      fontWeight: 'bold',
      marginBottom: 5,
  },
  message: {
      fontSize: 16,
      marginBottom: 5,
  },
  timestamp: {
      color: 'gray',
      fontSize: 12,
  },
  inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: '#ddd',
      padding: 10,
  },
  input: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 20,
      marginRight: 10,
  },
  sendButton: {
      backgroundColor: 'teal',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
  },
  sendButtonText: {
      color: '#fff',
      fontWeight: 'bold',
  },
  clearChatButton: {
    color: 'red',
    fontWeight: 'bold',
    marginRight: 10,
},
});