/**
 *  BLOCK: Book Details
 *  ---
 *  Add details for a book to a post or page.
 */

//  Import CSS.
import './editor.css'
import { debounce } from 'throttle-debounce'

const { __ } = wp.i18n
const { registerBlockType } = wp.blocks
const { RichText } = wp.blockEditor

const { InspectorControls } = wp.blockEditor;
const { TextControl , RadioControl } = wp.components;
const { Component } = wp.element;



registerBlockType('davidyeiser-detailer/book-details', {
  title: __( 'Врез-статья' ),
  icon: 'shield',
  category: 'common',
  keywords: [
    __( 'search' ),
    __( 'post' ),
  ],

  // Enable or disable support for low-level features

  supports: {
    // Turn off ability to edit HTML of block content
    html: false,
    // Turn off reusable block feature
    reusable: false,
    // Add alignwide and alignfull options
    align: false
  },

  // Set up data model for custom block
  attributes: {
    content: {
      type: 'string',
      selector: 'search-post-plugin-content',
    },
    title: {
      type: 'string',
      selector: 'search-post-plugin-title'
    },
    link: {
      type: 'string',
      selector: 'search-post-plugin-link'
    },
    image:{
      type: 'string',
      selector: 'search-post-plugin-image'
    },
    radioField: {
			type: 'string',
		},
  },

  // The UI for the WordPress editor
  edit: props => {
    let onChangeRadioField = (value) => {
      props.setAttributes( { radioField: value } );
      console.log(value);
    }
    let onChangeSearchPost =     debounce( 300, async (search) => {

      if( search.length < 3 ) {
        return
      }
      let response = await fetch( `https://beta.mbk.news/wp-json/wp/v2/search/?search=${encodeURI( search )}&per_page=1` )
      let results = await response.json();
      let postId = await results[0] ? results[0].id : null;

      if (postId) {
        console.log('postId' , postId)
        let postDataJSON = await fetch( `https://beta.mbk.news/wp-json/wp/v2/posts/${postId}` )


        let postData = await postDataJSON.json();
        let postImage = await fetch( `https://beta.mbk.news/wp-json/wp/v2/media?parent=${postId}` )
        let postImageData = await postImage.json();
          console.log('postImageData' , postImageData)
        let postImageURL = await `${postImageData[0].media_details.sizes.medium.source_url}`;
        let postContent = postData.excerpt.rendered.substr(3).split(' ').slice(0 , 11).join(' ') + '...';

        // Set the attributes
        props.setAttributes( {
          title: postData.title.rendered,
          content: postContent,
          link: postData.link,
          image: postImageURL,
        })

      }

    })

    let post_className = `block-search-post single_related_post ${props.attributes.radioField}`
    let output = <div className= {post_className}>
                    <img src = {props.attributes.image} className = "search-post-plugin-image" />
                    <a href={ props.attributes.link}>
                      <RichText
                        className="block-search-post-title"
                        value={props.attributes.title}
                        tagName="h3"
                        placeholder="Post title"

                      />
                    </a>
                    <RichText
                      className="block-search-post-content"
                      value={props.attributes.content}
                      tagName="p"
                      placeholder="Post content"
                    />
                </div>;


   return [
     ( <InspectorControls key='inspector' >
        <div class = "components-panel__body block-editor-block-inspector__advanced is-opened">
         <TextControl
            onChange= { value => onChangeSearchPost( value ) }
            label={ __( 'Select a Post' ) }
          />
         <RadioControl
  						label="Выберите позицию"
              selected = {props.attributes.radioField}
  						options={
  							[
                  { label: 'Лево', value: 'left' },
  								{ label: 'Право', value: 'right' },

  							]
  						}
  						onChange={ value => onChangeRadioField( value ) }
					/>
          <RichText

            value={props.attributes.title}
            tagName="p"
          />

        </div>
      </InspectorControls>
     ),
     <div>{output}</div>
   ]
 },
  // No save, dynamic block
  save: props => {
    return null
  }
})
