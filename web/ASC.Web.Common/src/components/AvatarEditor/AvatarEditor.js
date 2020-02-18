import React from 'react';
import PropTypes from 'prop-types';
import { Button, ModalDialog } from 'asc-web-components';
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

    componentDidUpdate(prevProps) {
        const { visible, image } = this.props;
        if (visible !== prevProps.visible) {
            this.setState({ visible });
        }
        if (image !== prevProps.image) {
            this.setState({ isContainsFile: !!image });
        }
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
    onChangeSize(data) {
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

    render() {

        const { visible } = this.state;
        const { displayType, headerLabel, maxSize, accept, image,
            chooseFileLabel, chooseMobileFileLabel, unknownTypeError,
            maxSizeFileError, unknownError, saveButtonLabel,
            className, id, style } = this.props;
        return (
            <ModalDialog
                className={className}
                displayType={displayType}
                headerContent={headerLabel}
                id={id}
                onClose={this.onClose}
                scale
                style={style}
                visible={visible}
                bodyContent={
                    <StyledAvatarEditor>
                        <AvatarEditorBody
                            accept={accept}
                            chooseFileLabel={chooseFileLabel}
                            chooseMobileFileLabel={chooseMobileFileLabel}
                            deleteImage={this.onDeleteImage}
                            image={image}
                            maxSize={maxSize * 1000000} // megabytes to bytes
                            maxSizeFileError={maxSizeFileError}
                            onImageChange={this.onChangeImage}
                            onLoadFile={this.onLoadFile}
                            onLoadFileError={this.onLoadFileError}
                            onPositionChange={this.onChangePosition}
                            onSizeChange={this.onChangeSize}
                            unknownError={unknownError}
                            unknownTypeError={unknownTypeError}
                            visible={visible}
                        />
                    </StyledAvatarEditor>
                }
                footerContent={[
                    <Button
                        key="SaveBtn"
                        label={saveButtonLabel}
                        onClick={this.onClickSaveButton}
                        primary
                        size="medium"
                    />
                ]}
            />
        );
    }
}

AvatarEditor.propTypes = {
    accept: PropTypes.arrayOf(PropTypes.string),
    chooseFileLabel: PropTypes.string,
    chooseMobileFileLabel: PropTypes.string,
    className: PropTypes.string,
    displayType: PropTypes.oneOf(['auto', 'modal', 'aside']),
    headerLabel: PropTypes.string,
    id: PropTypes.string,
    image: PropTypes.string,
    maxSize: PropTypes.number,
    maxSizeFileError: PropTypes.string,
    onClose: PropTypes.func,
    onDeleteImage: PropTypes.func,
    onImageChange: PropTypes.func,
    onLoadFile: PropTypes.func,
    onLoadFileError: PropTypes.func,
    onSave: PropTypes.func,
    saveButtonLabel: PropTypes.string,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    unknownError: PropTypes.string,
    unknownTypeError: PropTypes.string,
    visible: PropTypes.bool,
};

AvatarEditor.defaultProps = {
    accept: ['image/png', 'image/jpeg'],
    displayType: 'auto',
    headerLabel: 'Edit Photo',
    maxSize: 10, //10MB
    saveButtonLabel: 'Save',
    visible: false,
};

export default AvatarEditor;


