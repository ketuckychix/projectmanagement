import React from 'react';
import {ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, split, } from '@apollo/client';
import ProjectList from './component/projectlist/projectlist'
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';

//Set up WebSocket Link:;
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem('token')
    }
  }
})

//Set up Auth Link
const authLink = setContext((_, {headers}) => {
  //Get authentication token in local storage
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    }
  }
});

//API link
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink, 
  authLink.concat(httpLink),
);

//Setup ApolloClient
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  
});



class ProjectManagementApp extends React.Component {

    render(){
        return (
                <ApolloProvider client={client} >
                    <ProjectList/>
                </ApolloProvider>
        )
    }
}



export default ProjectManagementApp;