import { gql } from '@apollo/client';

const GET_UNSPLASH_IMAGES = gql`
  query GetUnsplashImages($pageNum: Int!) {
    unsplashImages(pageNum: $pageNum) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

const GET_BINNED_IMAGES = gql`
  query GetBinnedImages($pageNum: Int!) {
    binnedImages(pageNum: $pageNum) {
      id
      url
      description
      userPosted
      binned
      posterName
    }
  }
`;

const GET_MY_IMAGES = gql`
  query GetMyImages($pageNum: Int!) {
    userPostedImages(pageNum: $pageNum) {
      id
      url
      description
      userPosted
      binned
      posterName
    }
  }
`;

const UPLOAD_IMAGE = gql`
  mutation uploadTheImage($url: String!,
                          $description: String!,
                          $posterName: String!) {
    uploadImage(url: $url, 
                description: $description, 
                posterName: $posterName) {
      id
      url
      description
      posterName
      binned
      userPosted
    }
  }
`;

const UPDATE_IMAGE = gql`
  mutation updateTheImage(
    $id: ID!
    $url: String
    $posterName: String
    $description: String
    $userPosted: Boolean
    $binned: Boolean
  ) {
    updateImage(id: $id, url: $url, posterName: $posterName, description: $description, userPosted: $userPosted, binned: $binned) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

export default {
  GET_BINNED_IMAGES,
  GET_MY_IMAGES,
  GET_UNSPLASH_IMAGES,
  UPDATE_IMAGE,
  UPLOAD_IMAGE
}

