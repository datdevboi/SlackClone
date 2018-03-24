import gql from "apollo-boost";

const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;

export { allTeamsQuery };
