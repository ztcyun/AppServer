import React from 'react';
import PropTypes from 'prop-types';
import { Button, ModalDialog }  from 'asc-web-components';
import AvatarEditorBody from './sub-components/Body';
import StyledAvatarEditor from './StyledAvatarEditor';

class AvatarEditor extends React.Component {
    constructor(props) {
        super(props);
        const { image, visible } = props;

        this.state = {
            isContainsFile: !!image,
            visible,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            croppedImage: ''
        }

        this.onChangeImage = this.onChangeImage.bind(this);
        this.onLoadFileError = this.onLoadFileError.bind(this);
        this.onLoadFile = this.onLoadFile.bind(this);
        this.onChangePosition = this.onChangePosition.bind(this);
        this.onChangeSize = this.onChangeSize.bind(this);
        this.onDeleteImage = this.onDeleteImage.bind(this);
    }

    onChangeImage(file) {
        this.setState({
            croppedImage: file
        })
        if (typeof this.props.onImageChange === 'function') this.props.onImageChange(file);
    }
    onDeleteImage() {
        this.setState({
            isContainsFile: false
        })
        if (typeof this.props.onDeleteImage === 'function') this.props.onDeleteImage();
    }
    onChangeSize(data){
        this.setState(data);
    }
    onChangePosition(data) {
        this.setState(data);
    }
    onLoadFileError(error) {
        if (typeof this.props.onLoadFileError === 'function') this.props.onLoadFileError(error);
    }
    onLoadFile(file) {
        if (typeof this.props.onLoadFile === 'function') this.props.onLoadFile(file);
        this.setState({ isContainsFile: true });
    }
    onClickSaveButton = () => {
        const { isContainsFile, x, y, width, height, croppedImage } = this.state;
        const { onSave } = this.props;
        isContainsFile ?
            onSave(isContainsFile, {
                x,
                y,
                width,
                height
            }, croppedImage) :

            onSave(isContainsFile);
    }
    onClose = () => {
        this.setState({ visible: false });
        this.props.onClose();
    }
    componentDidUpdate(prevProps) {
        const { visible, image} = this.props;
        if (visible !== prevProps.visible) {
            this.setState({ visible });
        }
        if (image !== prevProps.image) {
            this.setState({ isContainsFile: !!image });
        }
    }

    render() {

        const { visible} = this.state;
        const { displayType, headerLabel, maxSize, accept, image,
            chooseFileLabel,chooseMobileFileLabel,unknownTypeError,
            maxSizeFileError, unknownError, saveButtonLabel,
            className, id, style } = this.props;
        return (
            <ModalDialog
                visible={visible}
                displayType={displayType}
                scale
                headerContent={headerLabel}
                bodyContent={
                    <StyledAvatarEditor>
                    <AvatarEditorBody
                        onImageChange={this.onChangeImage}
                        visible={visible}
                        onPositionChange={this.onChangePosition}
                        onSizeChange={this.onChangeSize}
                        onLoadFileError={this.onLoadFileError}
                        onLoadFile={this.onLoadFile}
                        deleteImage={this.onDeleteImage}
                        maxSize={maxSize * 1000000} // megabytes to bytes
                        accept={accept}
                        image={image}
                        chooseFileLabel={chooseFileLabel}
                        chooseMobileFileLabel={chooseMobileFileLabel}
                        unknownTypeError={unknownTypeError}
                        maxSizeFileError={maxSizeFileError}
                        unknownError={unknownError}
                    />
                    </StyledAvatarEditor>
                }
                footerContent={[
                    <Button
                        key="SaveBtn"
                        label={saveButtonLabel}
                        primary
                        size="medium"
                        onClick={this.onClickSaveButton}
                    />
                ]}
                onClose={this.onClose}
                className={className}
                id={id}
                style={style}
            />
        );
    }
}

AvatarEditor.propTypes = {
    visible: PropTypes.bool,
    headerLabel: PropTypes.string,
    chooseFileLabel: PropTypes.string,
    chooseMobileFileLabel: PropTypes.string,
    saveButtonLabel: PropTypes.string,
    maxSizeFileError: PropTypes.string,
    image: PropTypes.string,
    maxSize: PropTypes.number,
    accept: PropTypes.arrayOf(PropTypes.string),
    onSave: PropTypes.func,
    onClose: PropTypes.func,
    onDeleteImage: PropTypes.func,
    onLoadFile: PropTypes.func,
    onImageChange: PropTypes.func,
    onLoadFileError: PropTypes.func,
    unknownTypeError: PropTypes.string,
    unknownError: PropTypes.string,
    displayType: PropTypes.oneOf(['auto', 'modal', 'aside']),
    className: PropTypes.string,
    id: PropTypes.string,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

AvatarEditor.defaultProps = {
    visible: false,
    maxSize: 10, //10MB
    headerLabel: 'Edit Photo',
    saveButtonLabel: 'Save',
    accept: ['image/png', 'image/jpeg'],
    displayType: 'auto'
};

export default AvatarEditor;


