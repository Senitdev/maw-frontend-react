import React, { Component, PropTypes } from 'react';
import { Button } from 'antd';
import Rnd from 'react-rnd';

export default class SceneEditorTimelineItem extends Component {

  static propTypes = {
    editorDurationWidth: PropTypes.number.isRequired,
    itemsRef: PropTypes.object.isRequired,
    magnetIsActive: PropTypes.bool.isRequired,
    maxZindex: PropTypes.number.isRequired,
    media: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    relation: PropTypes.object.isRequired,
    scale: PropTypes.number.isRequired,
    scaling: PropTypes.number.isRequired,
    setCurrentMagnetX: PropTypes.func.isRequired,
    updateRelation: PropTypes.func.isRequired,
  }

  /* évite de render chaque item de la timeline à chaque mise à jours de l'interval
   * quand la scène est en lécture.
   */
  shouldComponentUpdate(nextProps) {
    if (this.props.relation === nextProps.relation
        && this.props.editorDurationWidth === nextProps.editorDurationWidth
        && this.props.scaling === nextProps.scaling
        && this.props.maxZindex === nextProps.maxZindex
        && this.props.itemsRef === nextProps.itemsRef
        && this.props.magnetIsActive === nextProps.magnetIsActive)
      return false;
    else
      return true;
  }

  componentWillUpdate(nextProps) {
  this.rnd.updatePosition({x:(nextProps.relation.startTimeOffset / nextProps.scaling * nextProps.editorDurationWidth),
                           y: nextProps.relation.zIndex * 50});
  }

  magneticPositionsX = {};
  magnetX = -1;

  /**
   * Pendant qu'on drag, si magnet est activé, garde en mémoire la dernière position magnetique.
   */
  draging = (event, ui) => {
    if (this.props.magnetIsActive) {
      const keys = Object.keys(this.magneticPositionsX);
      for (var i = 0; i < keys.length; i++) {
        let gapInPos = ui.position.left - keys[i];
        if (gapInPos > -15 && gapInPos < 15 ) {
          this.magnetX = keys[i];
          break;
        } else {
          this.magnetX = -1;
        }
      }
    }
    this.props.setCurrentMagnetX(this.magnetX);
  }

  resizing = (direction, styleSize, clientSize) => {
    if (this.props.magnetIsActive) {
      const keys = Object.keys(this.magneticPositionsX);
      for (var i = 0; i < keys.length; i++) {
        let gapInPos = this.rnd.state.x + clientSize.width  - keys[i];
        if (gapInPos > -15 && gapInPos < 15 ) {
          this.magnetX = keys[i];
          break;
        } else {
          this.magnetX = -1;
        }
      }
    }
    this.props.setCurrentMagnetX(this.magnetX);
  }

  /**
   * Récupère les positions de début et fin des élément dans la timeline.
   * les mets dans un object, les positions sont les clé, les valeurs sont les id des items à ces positions.
   */
  calculateMagneticPosition = () => {
    var newMagneticPositionsX = {};

    Object.keys(this.props.itemsRef).forEach((key) => {
      const relation = this.props.itemsRef[key].props.relation;
      if (relation.idRelation == this.props.relation.idRelation)
        return;

      let rndStartPosX = Math.round(relation.startTimeOffset / this.props.scaling * this.props.editorDurationWidth);
      let rndStopPosX = rndStartPosX + (Math.max(Math.round(relation.duration / this.props.scaling * this.props.editorDurationWidth), 30));

      if (newMagneticPositionsX[rndStartPosX])
        newMagneticPositionsX[rndStartPosX].push(relation.idRelation);
      else
        newMagneticPositionsX[rndStartPosX] = [relation.idRelation];
      if (newMagneticPositionsX[rndStopPosX])
        newMagneticPositionsX[rndStopPosX].push(relation.idRelation);
      else
        newMagneticPositionsX[rndStopPosX] = [relation.idRelation];
    });

    this.magneticPositionsX = newMagneticPositionsX;
  }

  getXFromRelation = (relation) => Math.round(relation.startTimeOffset / this.props.scaling * this.props.editorDurationWidth);
  getWidthFromRelation = (relation) => Math.max(Math.round(relation.duration / this.props.scaling * this.props.editorDurationWidth), 30);

  render() {
    const relation            = this.props.relation;
    const media               = this.props.media;
    const scaling             = this.props.scaling;
    const editorDurationWidth = this.props.editorDurationWidth;
    const scale               = this.props.scale;
    const x                   = this.getXFromRelation(relation);
    const y                   = relation.zIndex * 50;
    const width               = this.getWidthFromRelation(relation);
    const maxZindex           = this.props.maxZindex;
    const magnetIsActive      = this.props.magnetIsActive;

    return (
        <Rnd
          className="editor-separation-element"
          ref={(ref) => this.rnd = ref}
          initial={{
            x: x,
            y: y,
            width: width,
            height: 44,
          }}
          resizeGrid={[editorDurationWidth / (scaling / scale), 1]}
          moveGrid={[editorDurationWidth / (scaling / scale), 50]}
          bounds={{left: 0, right: 10000, top: 0, bottom: (maxZindex-1)*50}}
          isResizable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          }}
          onClick={() => this.props.onClick(relation.idRelation)}
          onDragStart={() => this.calculateMagneticPosition()}
          onDrag={(event, ui) => this.draging(event, ui)}
          onDragStop={(event, ui) => {
            const newZindex = Math.round((ui.position.top / 150 * 150) / 50);
            let newStart;
            if (magnetIsActive && this.magnetX > -1) {
              newStart = Math.round((this.magnetX / editorDurationWidth * scaling) / scale) * scale;
              this.rnd.updatePosition({x: this.magnetX, y: newZindex});
            } else {
              newStart = Math.round((ui.position.left / editorDurationWidth * scaling) / scale) * scale;
            }
            this.props.updateRelation(relation.idRelation, {startTimeOffset: newStart, zIndex: newZindex});
            this.magnetX = -1;
            this.props.setCurrentMagnetX(this.magnetX);
          }}
          onResizeStart={() => this.calculateMagneticPosition()}
          onResize={(direction, styleSize, clientSize) => this.resizing(direction, styleSize, clientSize)}
          onResizeStop={(direction, styleSize, clientSize) => {
            var newDuration;
            if (magnetIsActive && this.magnetX > -1) {
              newDuration = Math.round(((this.magnetX - x) / editorDurationWidth * scaling) / scale) * scale;
              this.rnd.updateSize({width: this.getWidthFromRelation(relation), height: 43});
            } else {
              newDuration = Math.round((clientSize.width / editorDurationWidth * scaling) / scale) * scale;
            }
            this.props.updateRelation(relation.idRelation, {duration: newDuration});
            this.magnetX = -1;
            this.props.setCurrentMagnetX(this.magnetX);
          }}
          >
          <div>
            <ul>
              <li>{media.name}</li>
              <li>{relation.startTimeOffset / 1000} : Décalage (s)</li>
              <li>{relation.duration == 0 ? <span>&infin;</span> : relation.duration / 1000}: Durée (s)</li>
            </ul>
            <Button title="Réinitialiser la durée" size="small" shape="circle" icon="reload"
              onClick={() => {
                const initDuration = media.duration == 0 ? 60000 : media.duration;
                this.props.updateRelation(relation.idRelation, {duration: initDuration});
              }}
            />
          </div>
        </Rnd>
    );
  }
}
