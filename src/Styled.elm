module Styled exposing (decodeModel, main, view)

import Html
import Html.Styled exposing (div, fromUnstyled, text, toUnstyled)
import Html.Styled.Attributes exposing (styled)
import Json.Decode as Decode exposing (Decoder, Value)
import Markdown


decodeModel : Decoder Model
decodeModel =
    Decode.map Model
        (Decode.field "who" Decode.string)


main : Program Never Model ()
main =
    Html.beginnerProgram
        { model =
            { who = "No-One"
            }
        , update = \_ model -> model
        , view = view
        }


type alias Model =
    { who : String
    }


view : Model -> Html.Html ()
view model =
    styled div
        []
        []
        [ Markdown.toHtml [] markdownContent |> fromUnstyled
        ]
    |> toUnstyled


markdownContent : String
markdownContent =
    """

# Some Heading

## Some subheading
Some content with __emphasis__.

* A list...
    * of lists
    * of lists

    """
